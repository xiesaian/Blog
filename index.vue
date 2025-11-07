methods：{
async deleteDirectory() {
  const rightTree = this.$refs.rightTree
  const allCheckedNodes = rightTree.getCheckedNodes(false, false)
  if (!allCheckedNodes.length) return

  const checkedDirs = allCheckedNodes.filter(
    n => n.type === 'region' || n.type === 'group'
  )
  if (!checkedDirs.length) return

  const getTopLevelCheckedNodes = (checkedNodes, treeRef) => {
    const topLevel = []
    const checkedMap = new Map()
    checkedNodes.forEach(node => checkedMap.set(node.uniqueKey, node))
    for (const node of checkedNodes) {
      const refNode = treeRef.getNode(node)
      let parent = refNode.parent
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
  }

  const topLevelNodes = getTopLevelCheckedNodes(checkedDirs, rightTree)
  if (!topLevelNodes.length) return

  // 递归提取设备节点
  const extractDevices = (node) => {
    let result = []
    if (!node.children) return result
    for (const child of node.children) {
      if (child.type !== 'region' && child.type !== 'group') {
        result.push(child)
      } else {
        result = result.concat(extractDevices(child))
      }
    }
    return result
  }

  const loading = this.$loading({
    lock: true,
    text: '正在删除目录...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  // ✅ 情况1：根节点被选中
  if (topLevelNodes.length === 1 && topLevelNodes[0].uniqueKey === 'xiesaian') {
    const rootNode = topLevelNodes[0]

    // 深拷贝断开响应式，避免死循环
    const dirsCopy = JSON.parse(JSON.stringify(rootNode.children || []))

    // 根节点下的目录（region / group）
    const dirNodes = dirsCopy.filter(n => n.type === 'region' || n.type === 'group')

    // 根节点下直接的设备
    let rootDevices = dirsCopy.filter(n => n.type !== 'region' && n.type !== 'group')

    // 总数（用于百分比）
    const totalLines = dirNodes.length || 1
    let count = 0
    for (const dir of dirNodes) {
      count++
      // const percent = Math.round((count / totalLines) * 100)
      loading.text = `正在删除目录 ${dir.name} (${count}/${totalLines})`

      // 提取设备
      const devices = extractDevices(dir)

      // 模拟延迟：让动画和 Vue 更新交替执行
      await new Promise(res => setTimeout(res, 200))

      // 找到当前目录在原始 children 中的位置
      const idx = rootNode.children.findIndex(c => c.uniqueKey === dir.uniqueKey)
      if (idx === -1) continue

      // 把设备插入到原位置
      const newChildren = [
        ...rootNode.children.slice(0, idx),
        ...devices,
        ...rootNode.children.slice(idx + 1),
      ]
      this.$set(rootNode, 'children', newChildren)

      // 等待 Vue 完成一次渲染
      await this.$nextTick()
    }

    loading.close()
    this.$message.success('✅ 所有目录删除完成！设备已移至根节点下')
    return
  }

  // ✅ 情况2：普通目录删除（并列多选）
  const total = topLevelNodes.length
  let i = 0
  for (const dir of topLevelNodes) {
    i++
    const node = rightTree.getNode(dir)
    if (!node || !node.parent) {
      // 更新进度显示（即使跳过也显示）
      // const pctSkip = Math.round((i / total) * 100)
      loading.text = `正在处理 ${i}/${total} ... `
      await new Promise(res => setTimeout(res, 100))
      continue
    }
    const parent = node.parent.data

    // const percent = Math.round((i / total) * 100)
    loading.text = `正在删除目录 ${dir.name} (${i}/${total})`
    await new Promise(res => setTimeout(res, 200))

    const devices = extractDevices(dir)
    const idx = parent.children.findIndex(c => c.uniqueKey === dir.uniqueKey)

    const newChildren = [
      ...parent.children.slice(0, idx),
      ...devices,
      ...parent.children.slice(idx + 1),
    ]
    this.$set(parent, 'children', newChildren)
    await this.$nextTick()
  }

  loading.close()
  this.$message.success('目录删除完成！')
},
}
