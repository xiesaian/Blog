methods：{
 // 工具：等待空闲帧/动画帧
  waitFrame() {
    return new Promise(resolve => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => resolve())
      } else if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        window.requestAnimationFrame(() => resolve())
      } else {
        setTimeout(() => resolve(), 0)
      }
    })
  },


    // 找出被选中的最上层目录节点（避免对子目录重复处理）
    getTopLevelCheckedNodes(checkedNodes, treeRef) {
      const topLevel = []
      const checkedMap = new Map()
      checkedNodes.forEach(node => checkedMap.set(node.uniqueKey, node))
      for (const node of checkedNodes) {
        const refNode = treeRef.getNode(node)
        let parent = refNode && refNode.parent
        let isTop = true
        while (parent && parent.data) {
          if (checkedMap.has(parent.data.uniqueKey)) {
            isTop = false
            break
          }
          parent = parent.parent
        }
        if (isTop) topLevel.push(node)
      }
      return topLevel
    },

     // 非递归遍历并提取设备（返回轻量 POJO，减少响应式开销）
    extractDevicesIterative(root) {
      const devices = []
      if (!root || !root.children || !root.children.length) return devices
      const stack = [...root.children]
      while (stack.length) {
        const node = stack.pop()
        if (!node) continue
        if (node.type === 'region' || node.type === 'group') {
          if (node.children && node.children.length) {
            // push 子节点
            for (let i = 0; i < node.children.length; i++) {
              stack.push(node.children[i])
            }
          }
        } else {
          // 只保留渲染/识别所需字段，避免把大量响应式结构搬到新数组
          devices.push({
            uniqueKey: node.uniqueKey,
            id: node.id,
            parentId: node.parentId,
            name: node.name,
            type: node.type,
            // 如有其它必须字段可按需添加
          })
        }
      }
      return devices
    },

     // 主方法：删除目录并把设备移到父级（或根）
    async deleteDirectory() {
      const rightTree = this.$refs.rightTree
      if (!rightTree) return

      const allCheckedNodes = rightTree.getCheckedNodes(false, false)
      if (!allCheckedNodes || !allCheckedNodes.length) return

      const checkedDirs = allCheckedNodes.filter(n => n.type === 'region' || n.type === 'group')
      if (!checkedDirs.length) return

      const topLevelNodes = this.getTopLevelCheckedNodes(checkedDirs, rightTree)
      if (!topLevelNodes.length) return

      // 配置：批次大小与 nextTick 间隔（可调）
      const BATCH_SIZE = 200 // 可根据实际测试逐步调整（尝试 50/100/200/500）
      const NEXTTICK_EVERY_BATCHES = 3 // 每多少个批次 await this.$nextTick() 一次，减少同步阻塞

      const loading = this.$loading({
        lock: true,
        text: '正在删除目录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      try {
        // 情况1：选中的是根节点（示例 root key 为 'xiesaian'）
        if (topLevelNodes.length === 1 && topLevelNodes[0].uniqueKey === 'xiesaian') {
          const rootNode = topLevelNodes[0]

          const dirNodes = (rootNode.children || []).filter(n => n.type === 'region' || n.type === 'group')
          if (!dirNodes.length) {
            loading.close()
            this.$message.info('没有需要删除的目录')
            return
          }

          for (let dIndex = 0; dIndex < dirNodes.length; dIndex++) {
            const dir = dirNodes[dIndex]
            loading.text = `正在删除目录 ${dir.name} (${dIndex + 1}/${dirNodes.length})`

            // 提取设备（CPU 密集工作）
            const devices = this.extractDevicesIterative(dir)

            // 找到 dir 在 rootNode.children 的位置（注意 rootNode.children 是响应式数组）
            const idx = (rootNode.children || []).findIndex(c => c.uniqueKey === dir.uniqueKey)
            if (idx === -1) continue

            // 原地删除目录节点（splice），避免替换整个数组造成大量 patch
            rootNode.children.splice(idx, 1)
            // 等一次渲染（但不要每批都频繁 await nextTick）
            await this.waitFrame()

            // 分批插入 devices（原地 splice），每插入若干批次允许 Vue 渲染一次
            let insertPos = idx
            let batchCount = 0
            for (let i = 0; i < devices.length; i += BATCH_SIZE) {
              const batch = devices.slice(i, i + BATCH_SIZE)
              // 原地插入
              rootNode.children.splice(insertPos, 0, ...batch)
              insertPos += batch.length
              batchCount++

              // 让浏览器/渲染有机会响应
              await this.waitFrame()
              if (batchCount % NEXTTICK_EVERY_BATCHES === 0) {
                // 尽量减少 nextTick 调用频率，降低同步阻塞
                await this.$nextTick()
              }
            }

            // 少量休息，避免连续多个目录处理把主线程占满
            await this.waitFrame()
          }

          loading.close()
          this.$message.success('✅ 所有目录删除完成！设备已移至根节点下（分批完成）')
          return
        }

        // 情况2：普通目录删除（并列多选）
        const total = topLevelNodes.length
        for (let i = 0; i < total; i++) {
          const dir = topLevelNodes[i]
          const seq = i + 1
          loading.text = `正在删除目录 ${dir.name} (${seq}/${total})`

          const node = rightTree.getNode(dir)
          if (!node || !node.parent) {
            await this.waitFrame()
            continue
          }
          const parent = node.parent.data

          // 提取设备并分批插入到 parent.children（原地 splice）
          const devices = this.extractDevicesIterative(dir)
          const idx = parent.children.findIndex(c => c.uniqueKey === dir.uniqueKey)
          if (idx === -1) {
            await this.waitFrame()
            continue
          }

          // 原地删除目录节点
          parent.children.splice(idx, 1)
          await this.waitFrame()

          // 分批插入设备
          let insertPos = idx
          let batchCount = 0
          for (let j = 0; j < devices.length; j += BATCH_SIZE) {
            const batch = devices.slice(j, j + BATCH_SIZE)
            parent.children.splice(insertPos, 0, ...batch)
            insertPos += batch.length
            batchCount++

            await this.waitFrame()
            if (batchCount % NEXTTICK_EVERY_BATCHES === 0) {
              await this.$nextTick()
            }
          }

          // 少量休息
          await this.waitFrame()
        }

        loading.close()
        this.$message.success('目录删除完成！')
      } catch (err) {
        loading.close()
        this.$message.error('删除目录过程中出错：' + (err && err.message ? err.message : String(err)))
        console.error(err)
      }
    },
}
