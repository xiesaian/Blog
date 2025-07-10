// 开始巡检
    async toCheck(row, index) {
      var that = this
      that.bottomImages = []
      that.visibleResult1List = []
      console.log('当前点击卡片数据', row)
      if (that.isCheck) {
        that.$message.warning('当前有巡检任务没结束')
        return
      }
      that.cleanAll()

      that.isCheck = true
      that.recordObj.status = 2
      that.recordObj.patrolLineName = row.name
      that.recordObj.name = row.name
      that.resultList[0].patrolLineName = row.name
      that.resultList[0].userName = localStorage.getItem('ioc_name')
      that.checkIndex = index
      that.checkObj = row
      that.myRow = row
      that.selectArea = row.id

      that.checkList[that.checkIndex].inspectAllCount = row.childrens.length
      that.checkList[that.checkIndex].qualifiedCount = row.childrens.length
      // that.changeSelectArea()
      console.log('开始巡检', row.childrens)
      if (row.childrens.length == 0) {
        that.$message.warning('当前巡更线路暂未配置设备！')
        return
      }
      that.patrolText = row.name
      that.currentPlan = row.childrens
      that.currentIndex = 0 // 当前播放的视频索引
      that.currentEventId = ''
      let patrolRecordTime = moment().format('YYYY-MM-DD HH:mm:ss')
      const patrolTemplate = {
        createTime: patrolRecordTime,
        endTime: patrolRecordTime,
        id: '',
        patrolLineId: '',
        patrolLineName: row.name,
        patrolLogId: '',
        patrolPointId: '',
        patrolPointName: '',
        realityTime: '',
        sort: 0,
        startTime: patrolRecordTime,
        status: 1,
        updateTime: patrolRecordTime,
        userId: localStorage.getItem('id'),
        userName: localStorage.getItem('ioc_name'),
      }
      let patrolRecordArg = {
        childrens: row.childrens.map((child) => ({
          ...patrolTemplate,
          ...child, // 有值就覆盖模板里的默认值
          updateTime: patrolRecordTime, // 特定字段可以强制再覆盖一层
        })),
        createTime: patrolRecordTime,
        updateTime: patrolRecordTime,
        startTime: patrolRecordTime,
        endTime: patrolRecordTime,
        id: '',
        name: row.name,
        patrolDate: patrolRecordTime,
        patrolLineId: that.myRow.id,
        patrolTasksId: '',
        status: 5,
      }
      addPatrolRecord(patrolRecordArg).then((resPatrolRecord) => {
        that.currentPatrolId = resPatrolRecord.data
      })
      await that.loadBottomImages(that.currentPlan)
      that.playNextVideo1(row,index) // 开始播放第一个视频
      this.toggleRightPanel()
},
async playNextVideo1(row,index){
      var that = this;
      if (that.currentIndex >= row.childrens.length) {
          console.log('所有视频播放完成')
          // for (let i = 0; i < that.currentIndex; i++) {
          //   that.bottomImages[i].status = '巡检已完成'
          // }
          // let count = Math.min(that.currentIndex, that.bottomImages.length)
          for (let i = 0; i < that.bottomImages.length; i++) {
            that.bottomImages[i].status = '巡检已完成'
          }
          that.$message.success(that.patrolText + '已巡检完成！')
          this.$refs['myVideo'].pause()
          this.isCheck = false
          // this.tryExecuteNextAutoTask();
          this.getStatistics()
          this.checkObj = {}
          this.toUnCheck(row)
          this.$refs['myMap'].cancelHighlight()
          return
        }
        if (that.currentIndex >= 0 && that.currentIndex <= 3) {
          const currentChild = row.childrens[that.currentIndex]
          getMapByDeviceId(
            qs.stringify({
              objectId: currentChild.patrolPointId,
              regionId: '',
            })
          )
            .then((res) => {
              if (res.data.length > 0) {
                if (res.data[0].id == sessionStorage.getItem('lastMapID')) {
                  // 在当前图上框选1或者框选2
                  that.$refs['myMap'].setCameraCenter(
                    currentChild.patrolPointId
                  )
                  sessionStorage.setItem(
                    'hightlightInfo',
                    JSON.stringify(res.data[0])
                  )
                } else {
                  if (that.$refs['myMap'].showVR) {
                    that.$refs['myMap'].resetMyMap(res.data)
                  } else {
                    // 重新渲染地图并框选
                    sessionStorage.setItem('lastMapID', res.data[0].id)
                    var mapHistory =
                      JSON.parse(sessionStorage.getItem('mapHistory')) || []
                    mapHistory.push(res.data[0])
                    sessionStorage.setItem(
                      'mapHistory',
                      JSON.stringify(mapHistory)
                    )
                    sessionStorage.setItem(
                      'hightlightInfo',
                      JSON.stringify(res.data[0])
                    )
                    console.log(
                      'test*************************************************'
                    )
                    that.$refs['myMap'].initMap(res.data[0].id, res.data[0])
                  }
                }
              } else {
                console.log('地图上暂未配置该监控点')
              }
            })
            .catch((err) => {
              // 错误处理
              console.error('错误:', err)
            })
            .finally(() => {})
          // that.bottomImages[that.currentIndex].status = '巡检进行中'
          that.bottomImages[that.currentIndex].status = '巡检进行中'
          var myIndex1 = 0
          if (
            this.currentIndex < 0 ||
            this.currentIndex >= that.bottomImages.length
          ) {
            myIndex1 = this.bottomImages.length - 1
          } else {
            myIndex1 = this.currentIndex
          }
          console.info('??????????????????????????1')
          console.info('??????????????????????????2', this.currentPlan)
          console.info('??????????????????????????3', myIndex1)
          let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
          let patrolDetailArg = {
            createTime: currentTime,
            endTime: currentTime,
            // id: '',
            patrolLineId: this.currentPlan[myIndex1].patrolLineId,
            patrolLineName: this.patrolText,
            patrolLogId: this.currentPatrolId,
            patrolPointId: this.currentPlan[myIndex1].patrolPointId,
            patrolPointName: this.currentPlan[myIndex1].patrolPointName,
            realityTime: currentTime,
            sort: this.currentPlan[myIndex1].sort,
            startTime: currentTime,
            status: 1,
            updateTime: currentTime,
            userId: localStorage.getItem('id'),
            userName: localStorage.getItem('ioc_name'),
          }
          addPatrolDetailRecord(patrolDetailArg).then(
            (resPatrolDetailRecord) => {
              that.currentPatrolDetailId = resPatrolDetailRecord.data
            }
          )
          // 设置前面所有项状态为 "巡检已完成"
          // let count1 = Math.min(that.currentIndex, that.bottomImages.length)
          for (let i = 0; i < that.currentIndex; i++) {
            that.bottomImages[i].status = '巡检已完成'
          }
          getLiveUrls(currentChild.patrolPointId, 'ws', that.mainStream)
            .then((res) => {
              if (res.code == 200) {
                let url = res.data && res.data.url ? res.data.url : ''
                that.currentUrl = url

                // that.$nextTick(() => {
                //   that.$refs['myVideo'].play(url)
                // })
                // 设置10秒后销毁当前视频并播放下一个

                that.timeoutId1 = setTimeout(() => {
                  that.$refs['myVideo'].pause()
                  that.getResult2List()
                  that.currentIndex++
                  var myIndex = 0
                  let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  if (
                    that.currentIndex < 0 ||
                    that.currentIndex >= that.bottomImages.length
                  ) {
                    myIndex = that.bottomImages.length - 1
                  } else {
                    myIndex = that.currentIndex
                  }
                  console.log('*****************777', that.visibleResult1List)
                  console.log('*****************778', that.currentPlan)
                  console.log('*****************779', myIndex)
                  let patrolDetailArg = {
                    createTime: currentTime,
                    endTime: currentTime,
                    id: that.currentPatrolDetailId,
                    patrolLineId: that.currentPlan[myIndex].patrolLineId,
                    patrolLineName: that.patrolText,
                    patrolLogId: that.currentPatrolId,
                    patrolPointId: that.currentPlan[myIndex].patrolPointId,
                    patrolPointName: that.currentPlan[myIndex].patrolPointName,
                    realityTime: currentTime,
                    sort: that.currentPlan[myIndex].sort,
                    startTime: currentTime,
                    status: 3,
                    updateTime: currentTime,
                    userId: localStorage.getItem('id'),
                    userName: localStorage.getItem('ioc_name'),
                  }
                  updatePatrolDetailRecord(patrolDetailArg).then(
                    (resPatrolDetailRecord) => {
                      // that.currentPatrolDetailId = resPatrolDetailRecord.data
                      // alert(resPatrolDetailRecord.data)
                    }
                  )
                  // playNextVideo() // 递归调用播放下一个视频
                  that.playNextVideo1(that.myRow,that.checkIndex);
                }, 10000)
              }
              // 替换开始
              // getDeviceInfo(currentChild.patrolPointId).then((res1) => {
              //   if (res1.code == 200) {
              //     if (res1.data.backgroundMap) {
              //       that.bottomImages.push(res1.data.backgroundMap)
              //       let myData = {
              //         bkgUrl: res1.data.backgroundMap || '',
              //         cameraName:
              //           row.childrens[that.currentIndex].patrolPointName || '',
              //         name: '',
              //         time: moment().format('YYYY-MM-DD HH:mm:ss'),
              //         advice: '无异常',
              //       }
              //       that.visibleResult1List.push(myData)
              //     }
              //     if (that.currentIndex == 0) {
              //       let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
              //       const year = dateStr.slice(2, 4) // '25'
              //       const month = dateStr.slice(5, 7) // '06'
              //       const day = dateStr.slice(8, 10) // '05'
              //       const hour = dateStr.slice(11, 13) // '15'
              //       const minute = dateStr.slice(14, 16) // '27'
              //       const second = dateStr.slice(17, 19) // '04'
              //       let addData = {
              //         eventName: row.name,
              //         startTime: dateStr,
              //         endTime: '',
              //         eventType: '视频巡站',
              //         eventLocation: '',
              //         regionId: row.regionId || '',
              //         regionName: '',
              //         indexCode: `PSC${year}${month}${day}${hour}${minute}${second}`,
              //         createName: localStorage.getItem('ioc_name'),
              //         taggings: [
              //           {
              //             remark: row.name + '-巡站抓图',
              //             sort: 0,
              //             urls:
              //               res1.data && res1.data.backgroundMap
              //                 ? res1.data.backgroundMap
              //                 : '',
              //           },
              //         ],
              //       }
              //       addEventRecall(addData).then((res) => {
              //         if (res.code == 200) {
              //           that.currentEventId = res.data
              //         }
              //       })
              //     } else if (that.currentIndex > 0 && !that.currentEventId) {
              //       let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
              //       const year = dateStr.slice(2, 4) // '25'
              //       const month = dateStr.slice(5, 7) // '06'
              //       const day = dateStr.slice(8, 10) // '05'
              //       const hour = dateStr.slice(11, 13) // '15'
              //       const minute = dateStr.slice(14, 16) // '27'
              //       const second = dateStr.slice(17, 19) // '04'
              //       let addData = {
              //         eventName: row.name,
              //         startTime: dateStr,
              //         endTime: '',
              //         eventType: '视频巡站',
              //         eventLocation: '',
              //         regionId: row.regionId || '',
              //         regionName: '',
              //         indexCode: `PSC${year}${month}${day}${hour}${minute}${second}`,
              //         createName: localStorage.getItem('ioc_name'),
              //         taggings: [
              //           {
              //             remark: row.name + '-巡站抓图',
              //             sort: 0,
              //             urls:
              //               res1.data && res1.data.backgroundMap
              //                 ? res1.data.backgroundMap
              //                 : '',
              //           },
              //         ],
              //       }
              //       addEventRecall(addData).then((res) => {
              //         if (res.code == 200) {
              //           that.currentEventId = res.data
              //         }
              //       })
              //     } else if (that.currentIndex > 0 && that.currentEventId) {
              //       if (res1.data && res1.data.backgroundMap) {
              //         eventRecallDetail(that.currentEventId).then((res) => {
              //           if (res.code == 200) {
              //             let updateData = res.data
              //             updateData.taggings = []
              //             updateData.taggings.push({
              //               remark: row.name + '-巡站抓图',
              //               sort: 0,
              //               urls: that.bottomImages.join(','),
              //             })
              //             editEventRecall(updateData).then((res) => {
              //               if (res.code == 200) {
              //                 console.log('更新事件库成功')
              //               }
              //             })
              //           }
              //         })
              //       }
              //     }
              //   }
              // })
              // 替换结束1
              // var myCurrentIndex = that.bottomImages.length - 1 - that.currentIndex
              let myData = {
                bkgUrl:
                  that.bottomImages[that.currentIndex].backgroundMap ||
                  '/default-picture.png',
                cameraName:
                  row.childrens[that.currentIndex].patrolPointName || '',
                name: '',
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                advice: '无异常',
              }
              that.visibleResult1List.unshift(myData)
              if (that.currentIndex == 0) {
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark:
                        that.visibleResult1List[
                          that.visibleResult1List.length - 1
                        ].advice,
                      sort: 0,
                      urls: that.bottomImages[0].backgroundMap || '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && !that.currentEventId) {
                const endIndex =
                  that.currentIndex >= 0
                    ? that.currentIndex
                    : that.bottomImages.length - 1
                const remark1 = that.visibleResult1List
                  .slice()
                  .reverse()
                  .slice(0, endIndex + 1)
                  .map((item) => item.advice)
                  .filter(Boolean)
                  .join(',')
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark: remark1,
                      sort: 0,
                      urls:
                        that.bottomImages[that.currentIndex].backgroundMap ||
                        '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && that.currentEventId) {
                if (
                  that.bottomImages &&
                  that.bottomImages[that.currentIndex].backgroundMap
                ) {
                  eventRecallDetail(that.currentEventId).then((res) => {
                    if (res.code == 200) {
                      const endIndex =
                        that.currentIndex >= 0
                          ? that.currentIndex
                          : that.bottomImages.length - 1
                      const remark2 = that.visibleResult1List
                        .slice()
                        .reverse()
                        .slice(0, endIndex + 1)
                        .map((item) => item.advice)
                        .filter(Boolean)
                        .join(',')
                      let updateData = res.data
                      updateData.taggings = []
                      updateData.taggings.push({
                        remark: remark2,
                        sort: 0,
                        urls: that.bottomImages
                          .map((item) => item.backgroundMap)
                          .join(','),
                      })
                      editEventRecall(updateData).then((res) => {
                        if (res.code == 200) {
                          console.log('更新事件库成功')
                        }
                      })
                    }
                  })
                }
              }
              // 替换结束2
            })
            .catch((err) => {
              // 错误处理
              console.info('拉流失败1:', err)
              that.currentUrl = ''
              that.timeoutId1 = setTimeout(() => {
                that.$refs['myVideo'].pause()
                that.getResult2List()
                that.currentIndex++
                var myIndex = 0
                let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
                if (
                  that.currentIndex < 0 ||
                  that.currentIndex >= that.bottomImages.length
                ) {
                  myIndex = that.bottomImages.length - 1
                } else {
                  myIndex = that.currentIndex
                }
                console.log('*****************777', that.visibleResult1List)
                console.log('*****************778', that.currentPlan)
                console.log('*****************779', myIndex)
                let patrolDetailArg = {
                  createTime: currentTime,
                  endTime: currentTime,
                  id: that.currentPatrolDetailId,
                  patrolLineId: that.currentPlan[myIndex].patrolLineId,
                  patrolLineName: that.patrolText,
                  patrolLogId: that.currentPatrolId,
                  patrolPointId: that.currentPlan[myIndex].patrolPointId,
                  patrolPointName: that.currentPlan[myIndex].patrolPointName,
                  realityTime: currentTime,
                  sort: that.currentPlan[myIndex].sort,
                  startTime: currentTime,
                  status: 3,
                  updateTime: currentTime,
                  userId: localStorage.getItem('id'),
                  userName: localStorage.getItem('ioc_name'),
                }
                updatePatrolDetailRecord(patrolDetailArg).then(
                  (resPatrolDetailRecord) => {
                    // that.currentPatrolDetailId = resPatrolDetailRecord.data
                    // alert(resPatrolDetailRecord.data)
                  }
                )
                playNextVideo() // 递归调用播放下一个视频
              }, 10000)
              // var myCurrentIndex = that.bottomImages.length - 1 - that.currentIndex
              let myData = {
                bkgUrl:
                  that.bottomImages[that.currentIndex].backgroundMap ||
                  '/default-picture.png',
                cameraName:
                  row.childrens[that.currentIndex].patrolPointName || '',
                name: '',
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                advice: '无异常',
              }
              that.visibleResult1List.unshift(myData)
              if (that.currentIndex == 0) {
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark:
                        that.visibleResult1List[
                          that.visibleResult1List.length - 1
                        ].advice,
                      sort: 0,
                      urls: that.bottomImages[0].backgroundMap || '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && !that.currentEventId) {
                const endIndex =
                  that.currentIndex >= 0
                    ? that.currentIndex
                    : that.bottomImages.length - 1
                const remark3 = that.visibleResult1List
                  .slice()
                  .reverse()
                  .slice(0, endIndex + 1)
                  .map((item) => item.advice)
                  .filter(Boolean)
                  .join(',')
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark: remark3,
                      sort: 0,
                      urls:
                        that.bottomImages[that.currentIndex].backgroundMap ||
                        '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && that.currentEventId) {
                if (
                  that.bottomImages &&
                  that.bottomImages[that.currentIndex].backgroundMap
                ) {
                  eventRecallDetail(that.currentEventId).then((res) => {
                    if (res.code == 200) {
                      const endIndex =
                        that.currentIndex >= 0
                          ? that.currentIndex
                          : that.bottomImages.length - 1
                      const remark4 = that.visibleResult1List
                        .slice()
                        .reverse()
                        .slice(0, endIndex + 1)
                        .map((item) => item.advice)
                        .filter(Boolean)
                        .join(',')
                      let updateData = res.data
                      updateData.taggings = []
                      updateData.taggings.push({
                        remark: remark4,
                        sort: 0,
                        urls: that.bottomImages
                          .map((item) => item.backgroundMap)
                          .join(','),
                      })
                      editEventRecall(updateData).then((res) => {
                        if (res.code == 200) {
                          console.log('更新事件库成功')
                        }
                      })
                    }
                  })
                }
              }
            })
        } else if (that.currentIndex > 3) {
          const bottomResults = await getDeviceInfo(
            that.currentPlan[that.currentIndex].patrolPointId
          )
          // unshift
          that.bottomImages.push({
            backgroundMap:
              bottomResults.data.backgroundMap || '/default-picture.png',
            cameraId: that.currentPlan[that.currentIndex].patrolPointId,
            cameraName: that.currentPlan[that.currentIndex].patrolPointName,
            status: '巡检未开始',
          })
          that.$nextTick(() => {
            setTimeout(() => {
              const container = that.$refs.imageContainer
              if (container) {
                container.scrollLeft = container.scrollWidth // 先最大
                container.scrollLeft =
                  container.scrollWidth - container.clientWidth // 再修正
              }
            }, 50)
          })
          // let myData2 = {
          //   bkgUrl: bottomResults.data.backgroundMap || '',
          //   cameraName: that.currentPlan[that.currentIndex].patrolPointName,
          //   name: '',
          //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
          //   advice: '无异常',
          // }
          // that.visibleResult1List.unshift(myData2)
          const currentChild = row.childrens[that.currentIndex]
          getMapByDeviceId(
            qs.stringify({
              objectId: currentChild.patrolPointId,
              regionId: '',
            })
          )
            .then((res) => {
              if (res.data.length > 0) {
                if (res.data[0].id == sessionStorage.getItem('lastMapID')) {
                  // 在当前图上框选1或者框选2
                  that.$refs['myMap'].setCameraCenter(
                    currentChild.patrolPointId
                  )
                  sessionStorage.setItem(
                    'hightlightInfo',
                    JSON.stringify(res.data[0])
                  )
                } else {
                  if (that.$refs['myMap'].showVR) {
                    that.$refs['myMap'].resetMyMap(res.data)
                  } else {
                    // 重新渲染地图并框选
                    sessionStorage.setItem('lastMapID', res.data[0].id)
                    var mapHistory =
                      JSON.parse(sessionStorage.getItem('mapHistory')) || []
                    mapHistory.push(res.data[0])
                    sessionStorage.setItem(
                      'mapHistory',
                      JSON.stringify(mapHistory)
                    )
                    sessionStorage.setItem(
                      'hightlightInfo',
                      JSON.stringify(res.data[0])
                    )
                    console.log(
                      'test*************************************************'
                    )
                    that.$refs['myMap'].initMap(res.data[0].id, res.data[0])
                  }
                }
              } else {
                console.log('地图上暂未配置该监控点')
              }
            })
            .catch((err) => {
              // 错误处理
              console.error('错误:', err)
            })
            .finally(() => {})
          // that.bottomImages[that.currentIndex].status = '巡检进行中'
          that.bottomImages[that.currentIndex].status = '巡检进行中'
          var myIndex1 = 0
          if (
            this.currentIndex < 0 ||
            this.currentIndex >= that.bottomImages.length
          ) {
            myIndex1 = this.bottomImages.length - 1
          } else {
            myIndex1 = this.currentIndex
          }
          console.info('??????????????????????????1')
          console.info('??????????????????????????2', this.currentPlan)
          console.info('??????????????????????????3', myIndex1)
          let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
          let patrolDetailArg = {
            createTime: currentTime,
            endTime: currentTime,
            // id: '',
            patrolLineId: this.currentPlan[myIndex1].patrolLineId,
            patrolLineName: this.patrolText,
            patrolLogId: this.currentPatrolId,
            patrolPointId: this.currentPlan[myIndex1].patrolPointId,
            patrolPointName: this.currentPlan[myIndex1].patrolPointName,
            realityTime: currentTime,
            sort: this.currentPlan[myIndex1].sort,
            startTime: currentTime,
            status: 1,
            updateTime: currentTime,
            userId: localStorage.getItem('id'),
            userName: localStorage.getItem('ioc_name'),
          }
          addPatrolDetailRecord(patrolDetailArg).then(
            (resPatrolDetailRecord) => {
              that.currentPatrolDetailId = resPatrolDetailRecord.data
            }
          )
          // 设置前面所有项状态为 "巡检已完成"
          // let count1 = Math.min(that.currentIndex, that.bottomImages.length)
          for (let i = 0; i < that.currentIndex; i++) {
            that.bottomImages[i].status = '巡检已完成'
          }
          getLiveUrls(currentChild.patrolPointId, 'ws', that.mainStream)
            .then((res) => {
              if (res.code == 200) {
                let url = res.data && res.data.url ? res.data.url : ''
                that.currentUrl = url

                // that.$nextTick(() => {
                //   that.$refs['myVideo'].play(url)
                // })
                // 设置10秒后销毁当前视频并播放下一个

                that.timeoutId1 = setTimeout(() => {
                  that.$refs['myVideo'].pause()
                  that.getResult2List()
                  that.currentIndex++
                  var myIndex = 0
                  let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  if (
                    that.currentIndex < 0 ||
                    that.currentIndex >= that.bottomImages.length
                  ) {
                    myIndex = that.bottomImages.length - 1
                  } else {
                    myIndex = that.currentIndex
                  }
                  console.log('*****************777', that.visibleResult1List)
                  console.log('*****************778', that.currentPlan)
                  console.log('*****************779', myIndex)
                  let patrolDetailArg = {
                    createTime: currentTime,
                    endTime: currentTime,
                    id: that.currentPatrolDetailId,
                    patrolLineId: that.currentPlan[myIndex].patrolLineId,
                    patrolLineName: that.patrolText,
                    patrolLogId: that.currentPatrolId,
                    patrolPointId: that.currentPlan[myIndex].patrolPointId,
                    patrolPointName: that.currentPlan[myIndex].patrolPointName,
                    realityTime: currentTime,
                    sort: that.currentPlan[myIndex].sort,
                    startTime: currentTime,
                    status: 3,
                    updateTime: currentTime,
                    userId: localStorage.getItem('id'),
                    userName: localStorage.getItem('ioc_name'),
                  }
                  updatePatrolDetailRecord(patrolDetailArg).then(
                    (resPatrolDetailRecord) => {
                      // that.currentPatrolDetailId = resPatrolDetailRecord.data
                      // alert(resPatrolDetailRecord.data)
                    }
                  )
                  playNextVideo() // 递归调用播放下一个视频
                }, 10000)
              }
              // 替换开始
              // getDeviceInfo(currentChild.patrolPointId).then((res1) => {
              //   if (res1.code == 200) {
              //     if (res1.data.backgroundMap) {
              //       that.bottomImages.push(res1.data.backgroundMap)
              //       let myData = {
              //         bkgUrl: res1.data.backgroundMap || '',
              //         cameraName:
              //           row.childrens[that.currentIndex].patrolPointName || '',
              //         name: '',
              //         time: moment().format('YYYY-MM-DD HH:mm:ss'),
              //         advice: '无异常',
              //       }
              //       that.visibleResult1List.push(myData)
              //     }
              //     if (that.currentIndex == 0) {
              //       let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
              //       const year = dateStr.slice(2, 4) // '25'
              //       const month = dateStr.slice(5, 7) // '06'
              //       const day = dateStr.slice(8, 10) // '05'
              //       const hour = dateStr.slice(11, 13) // '15'
              //       const minute = dateStr.slice(14, 16) // '27'
              //       const second = dateStr.slice(17, 19) // '04'
              //       let addData = {
              //         eventName: row.name,
              //         startTime: dateStr,
              //         endTime: '',
              //         eventType: '视频巡站',
              //         eventLocation: '',
              //         regionId: row.regionId || '',
              //         regionName: '',
              //         indexCode: `PSC${year}${month}${day}${hour}${minute}${second}`,
              //         createName: localStorage.getItem('ioc_name'),
              //         taggings: [
              //           {
              //             remark: row.name + '-巡站抓图',
              //             sort: 0,
              //             urls:
              //               res1.data && res1.data.backgroundMap
              //                 ? res1.data.backgroundMap
              //                 : '',
              //           },
              //         ],
              //       }
              //       addEventRecall(addData).then((res) => {
              //         if (res.code == 200) {
              //           that.currentEventId = res.data
              //         }
              //       })
              //     } else if (that.currentIndex > 0 && !that.currentEventId) {
              //       let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
              //       const year = dateStr.slice(2, 4) // '25'
              //       const month = dateStr.slice(5, 7) // '06'
              //       const day = dateStr.slice(8, 10) // '05'
              //       const hour = dateStr.slice(11, 13) // '15'
              //       const minute = dateStr.slice(14, 16) // '27'
              //       const second = dateStr.slice(17, 19) // '04'
              //       let addData = {
              //         eventName: row.name,
              //         startTime: dateStr,
              //         endTime: '',
              //         eventType: '视频巡站',
              //         eventLocation: '',
              //         regionId: row.regionId || '',
              //         regionName: '',
              //         indexCode: `PSC${year}${month}${day}${hour}${minute}${second}`,
              //         createName: localStorage.getItem('ioc_name'),
              //         taggings: [
              //           {
              //             remark: row.name + '-巡站抓图',
              //             sort: 0,
              //             urls:
              //               res1.data && res1.data.backgroundMap
              //                 ? res1.data.backgroundMap
              //                 : '',
              //           },
              //         ],
              //       }
              //       addEventRecall(addData).then((res) => {
              //         if (res.code == 200) {
              //           that.currentEventId = res.data
              //         }
              //       })
              //     } else if (that.currentIndex > 0 && that.currentEventId) {
              //       if (res1.data && res1.data.backgroundMap) {
              //         eventRecallDetail(that.currentEventId).then((res) => {
              //           if (res.code == 200) {
              //             let updateData = res.data
              //             updateData.taggings = []
              //             updateData.taggings.push({
              //               remark: row.name + '-巡站抓图',
              //               sort: 0,
              //               urls: that.bottomImages.join(','),
              //             })
              //             editEventRecall(updateData).then((res) => {
              //               if (res.code == 200) {
              //                 console.log('更新事件库成功')
              //               }
              //             })
              //           }
              //         })
              //       }
              //     }
              //   }
              // })
              // 替换结束1
              // var myCurrentIndex = that.bottomImages.length - 1 - that.currentIndex
              let myData = {
                bkgUrl:
                  that.bottomImages[that.currentIndex].backgroundMap ||
                  '/default-picture.png',
                cameraName:
                  row.childrens[that.currentIndex].patrolPointName || '',
                name: '',
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                advice: '无异常',
              }
              that.visibleResult1List.unshift(myData)
              that.$nextTick(() => {
                const container = that.$refs.resultContainer
                if (container) {
                  container.scrollTop = 0 // 滚动到最上边
                }
              })
              if (that.currentIndex == 0) {
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark:
                        that.visibleResult1List[
                          that.visibleResult1List.length - 1
                        ].advice,
                      sort: 0,
                      urls: that.bottomImages[0].backgroundMap || '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && !that.currentEventId) {
                const endIndex =
                  that.currentIndex >= 0
                    ? that.currentIndex
                    : that.bottomImages.length - 1
                const remark5 = that.visibleResult1List
                  .slice()
                  .reverse()
                  .slice(0, endIndex + 1)
                  .map((item) => item.advice)
                  .filter(Boolean)
                  .join(',')
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark: remark5,
                      sort: 0,
                      urls:
                        that.bottomImages[that.currentIndex].backgroundMap ||
                        '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && that.currentEventId) {
                if (
                  that.bottomImages &&
                  that.bottomImages[that.currentIndex].backgroundMap
                ) {
                  eventRecallDetail(that.currentEventId).then((res) => {
                    if (res.code == 200) {
                      const endIndex =
                        that.currentIndex >= 0
                          ? that.currentIndex
                          : that.bottomImages.length - 1
                      const remark6 = that.visibleResult1List
                        .slice()
                        .reverse()
                        .slice(0, endIndex + 1)
                        .map((item) => item.advice)
                        .filter(Boolean)
                        .join(',')
                      let updateData = res.data
                      updateData.taggings = []
                      updateData.taggings.push({
                        remark: remark6,
                        sort: 0,
                        urls: that.bottomImages
                          .map((item) => item.backgroundMap)
                          .join(','),
                      })
                      editEventRecall(updateData).then((res) => {
                        if (res.code == 200) {
                          console.log('更新事件库成功')
                        }
                      })
                    }
                  })
                }
              }
              // 替换结束2
            })
            .catch((err) => {
              // 错误处理
              console.info('拉流失败2:', err)
              that.currentUrl = ''
              that.timeoutId1 = setTimeout(() => {
                that.$refs['myVideo'].pause()
                that.getResult2List()
                that.currentIndex++
                var myIndex = 0
                let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
                if (
                  that.currentIndex < 0 ||
                  that.currentIndex >= that.bottomImages.length
                ) {
                  myIndex = that.bottomImages.length - 1
                } else {
                  myIndex = that.currentIndex
                }
                console.log('*****************777', that.visibleResult1List)
                console.log('*****************778', that.currentPlan)
                console.log('*****************779', myIndex)
                let patrolDetailArg = {
                  createTime: currentTime,
                  endTime: currentTime,
                  id: that.currentPatrolDetailId,
                  patrolLineId: that.currentPlan[myIndex].patrolLineId,
                  patrolLineName: that.patrolText,
                  patrolLogId: that.currentPatrolId,
                  patrolPointId: that.currentPlan[myIndex].patrolPointId,
                  patrolPointName: that.currentPlan[myIndex].patrolPointName,
                  realityTime: currentTime,
                  sort: that.currentPlan[myIndex].sort,
                  startTime: currentTime,
                  status: 3,
                  updateTime: currentTime,
                  userId: localStorage.getItem('id'),
                  userName: localStorage.getItem('ioc_name'),
                }
                updatePatrolDetailRecord(patrolDetailArg).then(
                  (resPatrolDetailRecord) => {
                    // that.currentPatrolDetailId = resPatrolDetailRecord.data
                    // alert(resPatrolDetailRecord.data)
                  }
                )
                playNextVideo() // 递归调用播放下一个视频
              }, 10000)
              // var myCurrentIndex = that.bottomImages.length - 1 - that.currentIndex
              let myData = {
                bkgUrl:
                  that.bottomImages[that.currentIndex].backgroundMap ||
                  '/default-picture.png',
                cameraName:
                  row.childrens[that.currentIndex].patrolPointName || '',
                name: '',
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                advice: '无异常',
              }
              that.visibleResult1List.unshift(myData)
              that.$nextTick(() => {
                const container = that.$refs.resultContainer
                if (container) {
                  container.scrollTop = 0 // 滚动到最上边
                }
              })
              if (that.currentIndex == 0) {
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark:
                        that.visibleResult1List[
                          that.visibleResult1List.length - 1
                        ].advice,
                      sort: 0,
                      urls: that.bottomImages[0].backgroundMap || '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && !that.currentEventId) {
                const endIndex =
                  that.currentIndex >= 0
                    ? that.currentIndex
                    : that.bottomImages.length - 1
                const remark6 = that.visibleResult1List
                  .slice()
                  .reverse()
                  .slice(0, endIndex + 1)
                  .map((item) => item.advice)
                  .filter(Boolean)
                  .join(',')
                let dateStr = moment().format('YYYY-MM-DD HH:mm:ss')
                let dateStr1 = dateStr.replace(/[-:\s]/g, '')
                let addData = {
                  eventName: row.name,
                  startTime: dateStr,
                  endTime: '',
                  eventType: '视频巡站',
                  eventLocation: '',
                  regionId: row.regionId || '',
                  regionName: '',
                  indexCode: `PSC${dateStr1}`,
                  createName: localStorage.getItem('ioc_name'),
                  taggings: [
                    {
                      remark: remark6,
                      sort: 0,
                      urls:
                        that.bottomImages[that.currentIndex].backgroundMap ||
                        '',
                    },
                  ],
                }
                addEventRecall(addData).then((res) => {
                  if (res.code == 200) {
                    that.currentEventId = res.data
                  }
                })
              } else if (that.currentIndex > 0 && that.currentEventId) {
                if (
                  that.bottomImages &&
                  that.bottomImages[that.currentIndex].backgroundMap
                ) {
                  eventRecallDetail(that.currentEventId).then((res) => {
                    if (res.code == 200) {
                      const endIndex =
                        that.currentIndex >= 0
                          ? that.currentIndex
                          : that.bottomImages.length - 1
                      const remark7 = that.visibleResult1List
                        .slice()
                        .reverse()
                        .slice(0, endIndex + 1)
                        .map((item) => item.advice)
                        .filter(Boolean)
                        .join(',')
                      let updateData = res.data
                      updateData.taggings = []
                      updateData.taggings.push({
                        remark: remark7,
                        sort: 0,
                        urls: that.bottomImages
                          .map((item) => item.backgroundMap)
                          .join(','),
                      })
                      editEventRecall(updateData).then((res) => {
                        if (res.code == 200) {
                          console.log('更新事件库成功')
                        }
                      })
                    }
                  })
                }
              }
            })
        }
    },
