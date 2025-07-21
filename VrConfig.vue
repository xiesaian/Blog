<template>
  <div id="vr01">
    <el-button-group class="button-wrap">
      <el-button size="mini" type="primary" @click="addLink()"
        >添加漫游点</el-button
      >
      <el-button size="mini" type="primary" @click="addMarker()"
        >添加标注点</el-button
      >
      <el-button size="mini" type="primary" @click="saveDraw()">保存</el-button>
      <!-- <el-button
        size="mini"
        type="primary"
        @click="setCameraCenter('10000000001320000005')"
        >聚焦</el-button
      >
      <el-button size="mini" type="primary" @click="cancelHighlight()">取消高亮</el-button> -->
    </el-button-group>
    <div id="vr-container" @dragover.prevent
    @drop="handleDrop" ref="vrContainer"></div>
    <el-dialog
      ref="markPoint"
      width="600px"
      :close-on-click-modal="false"
      :before-close="handleMarkerClose"
      :title="isMarkerAdd == true ? '设置标注点信息' : '修改标注点信息'"
      :modal="false"
      id="my-modal"
      :visible.sync="dialogMarkerVisible"
    >
      <el-form
        ref="markerForm"
        :model="markerForm"
        :rules="markRules"
        class="markerForm"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="markerForm.name"
                placeholder="请输入标注点名称"
                autocomplete="off"
                size="mini"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="关联地图" :label-width="formLabelWidth">
          <!-- <el-upload
            drag
            :headers="headers"
            class="upload-demo"
            action="/core/file/uploadFile"
            accept=".png,.jpg,.jpeg"
            :file-list="fileList"
            :auto-upload="true"
            name="mpFile"
            :on-change="onchange"
            :before-remove="beforeRemove"
            :limit="1"
            :on-remove="handleRemove"
            :on-success="onUploadSuccess"
            :on-exceed="handleExceed"
            list-type="picture"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="font-size: 12px">
              将图片文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload> -->
          <CascaderTarget :key="Date.now()" :treeData="linkMapList" targetType="map" :targetId="markerForm.linkMapId" @getMapValue="getMapValue1" />
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="handleMarkerDelete"
          size="mini"
          v-show="isMarkerAdd == false"
          >删 除</el-button
        >
        <el-button @click="handleMarkerClose" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmMarkerForm()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      ref="linkPoint"
      width="600px"
      :close-on-click-modal="false"
      :before-close="handleLinkClose"
      :title="isLinkAdd == true ? '设置漫游点信息' : '修改漫游点信息'"
      :modal="false"
      id="my-modal1"
      :visible.sync="dialogLinkVisible"
    >
      <el-form
        ref="linkForm"
        :model="linkForm"
        :rules="linkRules"
        class="linkForm"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input
                v-model="linkForm.name"
                placeholder="请输入漫游点名称"
                autocomplete="off"
                size="mini"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label="关联地图"
              :label-width="formLabelWidth"
              prop="linkMapId"
            >
            <CascaderTarget :key="Date.now()" :treeData="linkMapList" targetType="map" :targetId="linkForm.linkMapId" @getMapValue="getMapValue" />
              <!-- <select-tree
                placeholder="请选择"
                :props="{
                  value: 'id',
                  label: 'name',
                  children: 'children',
                }"
                :options="linkMapList"
                :value="linkForm.linkMapId"
                size="mini"
                :clearable="false"
                :isCheckMap="true"
                :isFontGreen="true"
                :accordion="true"
                :targetType="targetType"
                @getValue="getMapValue($event)"
                style="width: 100%"
              /> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="handleLinkDelete"
          size="mini"
          v-show="isLinkAdd == false"
          >删 除</el-button
        >
        <el-button @click="handleLinkClose" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmLinkForm()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import gsap from 'gsap'
// import { getToken } from '@/utils/auth'
import * as THREE from 'three'
import CascaderTarget from "./CascaderTarget"
// import TWEEN from 'tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getMapTree, addManyLabel, getMapLabelList } from '@/api/system-manager'

// 定义场景
const scene = new THREE.Scene()
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls
var camera
var renderer
var raycaster
// var tween;
var initialCameraPosition = { x: 0, y: 0, z: 3 }
var mouse = new THREE.Vector2()
// var sphere, sphereTexture
// 监控点标记组，方便统一管理
var cameraGroup = new THREE.Group()
// 漫游标记组，方便统一管理
var linkGroup = new THREE.Group()
// 文字标题组，方便统一管理
var textGroup = new THREE.Group()
// 标注标题组，方便统一管理
var markerGroup = new THREE.Group()

export default {
  name: 'VrConfig',
  components: {
    // Thumbnail,
    CascaderTarget
  },
  props: {
    rowDetail: {
      type: Object,
      default: () => {},
      required: true,
    },
    currentPicUrl: {
      type: String,
      default: '',
      required: true,
    },
    markerType: {
      type: String,
      default: '',
      required: true,
    },
    markerItem: {
      type: Object,
      default: () => {},
      required: true,
    },
    activeName: {
      type: String,
      default: 'first',
      required: true,
    },
  },
  data() {
    return {
      // cameraImg: require('@/assets/images/kanas/control-camera-click.png'),
      // linkImg: require('@/assets/images/kanas/link.png'),
      // labelImg: require('@/assets/images/kanas/label.png'),
      // sphere: null,
      // sphereTexture: null,
      targetType: 'map',
      linkMapList: [],
      renderId: null, // 当前激活按钮的 key
      activeButton: null, // 当前激活按钮的 key
      dataList: {
        marker: [], // 标注点数据
        link: [], // 漫游点数据
        label: [], // 监控点数据
      },
      isClickCamera: false, // 是否点击了相机
      isClickLink: false, // 是否点击了漫游点
      isClickMarker: false, // 是否点击了标注点
      isMarkerAdd: true, // 控制arker弹窗标题
      isLinkAdd: true, // 控制link弹窗标题
      dialogMarkerVisible: false, // 控制marker弹窗显示隐藏
      dialogLinkVisible: false, // 控制link弹窗显示隐藏
      formLabelWidth: '100px',
      markerForm: {
        name: '',
        linkMapId: '',
      },
      linkForm: {
        name: '',
        linkMapId: '',
      },
      // fileList: [],
      markRules: {
        name: [
          { required: true, message: '请输入标注点名称', trigger: 'blur' },
        ],
        linkMapId: [
          {
            required: true,
            message: '请选择标注点关联的地图',
            trigger: 'blur',
          },
        ],
      },
      linkRules: {
        name: [
          { required: true, message: '请输入漫游点名称', trigger: 'blur' },
        ],
        linkMapId: [
          {
            required: true,
            message: '请选择漫游点关联的地图',
            trigger: 'blur',
          },
        ],
      },
      clickedPoint: {
        x: 0,
        y: 0,
        z: 0,
      },
      rightClickedId: null, // 右键点击的对象ID
      highlightedCameraId: null, // 当前高亮的camera id
    }
  },
  // computed: {
  //   headers() {
  //     return {
  //       Method: 'post',
  //       Authorization: 'Bearer ' + getToken(),
  //       Module: 'szbj',
  //     }
  //   },
  // },
  watch: {
    markerItem: {
      handler(newVal) {
        if (newVal && newVal.type == 'camera') {
          this.isClickCamera = true
          this.isClickLink = false
          this.isClickMarker = false
        } else {
          this.isClickCamera = false
          this.isClickLink = false
          this.isClickMarker = false
        }
      },
      immediate: false,
      deep: true,
    },
    rowDetail: {
      handler(newVal) {
        if (newVal && newVal.type == 'camera') {
          this.isClickCamera = true
          this.isClickLink = false
          this.isClickMarker = false
        } else {
          this.isClickCamera = false
          this.isClickLink = false
          this.isClickMarker = false
        }
      },
      immediate: false,
      deep: true,
    },
  },
  methods: {
    handleDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move' // 👈 关键点，去掉加号！
    },
    handleDrop(e){
      const device = JSON.parse(e.dataTransfer.getData('text/plain'))
      const rect = this.$refs.vrContainer.getBoundingClientRect()
      const mouse = new THREE.Vector2()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markerGroup.children, true)
      if (intersects.length > 0) {
        const marker = intersects[0].object.userData
        console.warn('device',device);
        console.warn('marker',marker);
        let msg = '绑定' + device.type + '设备' + device.name +'到' + marker.name +'上';
        this.$message.success(msg)
      } else {
        // this.$message.warning('未命中任何标注点')
      }
    },
    // setCameraCenter(cameraId) {
    //   // 1. 找目标点坐标
    //   const cameraData = this.dataList.label.find(
    //     (item) => item.id === cameraId
    //   )
    //   if (!cameraData) {
    //     this.$message.error('未找到对应的摄像机')
    //     return
    //   }
    //   const pos = new THREE.Vector3(cameraData.x, cameraData.y, cameraData.z)

    //   // 2. 单位方向向量
    //   const dir = pos.clone().normalize()

    //   // 3. 镜像对称点（相机新位置方向）
    //   const mirroredDir = dir.clone().negate()

    //   // 4. 原始相机距离
    //   const radius = camera.position.length()

    //   // 5. 新相机位置
    //   const newCamPos = mirroredDir.multiplyScalar(radius)

    //   // 6. 动画
    //   gsap.to(camera.position, {
    //     x: newCamPos.x,
    //     y: newCamPos.y,
    //     z: newCamPos.z,
    //     duration: 1.2,
    //     onUpdate: () => {
    //       camera.lookAt(0, 0, 0)
    //       controls.target.set(0, 0, 0)
    //       controls.update()
    //     },
    //     onComplete: () => {
    //       this.highlightCameraSprite(cameraId)
    //     },
    //   })
    // },
    // highlightCameraSprite(cameraId) {
    //   // 1. 清除已有边框
    //   cameraGroup.children.forEach((child) => {
    //     if (child.userData.isHighlightBorder) {
    //       cameraGroup.remove(child)
    //     }
    //   })

    //   // 2. 找到目标sprite
    //   const targetSprite = cameraGroup.children.find(
    //     (child) => child.userData.id === cameraId
    //   )
    //   if (!targetSprite) return

    //   // 3. 生成带红色边框的canvas纹理
    //   const size = 128 // 纹理分辨率
    //   const borderWidth = 8 // 边框宽度
    //   const canvas = document.createElement('canvas')
    //   canvas.width = canvas.height = size
    //   const ctx = canvas.getContext('2d')
    //   // 透明背景
    //   ctx.clearRect(0, 0, size, size)
    //   // 红色边框
    //   ctx.strokeStyle = '#ff0000'
    //   ctx.lineWidth = borderWidth
    //   ctx.strokeRect(
    //     borderWidth / 2,
    //     borderWidth / 2,
    //     size - borderWidth,
    //     size - borderWidth
    //   )
    //   // 中间透明
    //   ctx.globalCompositeOperation = 'destination-out'
    //   ctx.fillRect(
    //     borderWidth,
    //     borderWidth,
    //     size - borderWidth * 2,
    //     size - borderWidth * 2
    //   )

    //   // 4. 用canvas做SpriteMaterial
    //   const borderTexture = new THREE.CanvasTexture(canvas)
    //   const borderMaterial = new THREE.SpriteMaterial({
    //     map: borderTexture,
    //     transparent: true,
    //     depthTest: false,
    //   })
    //   const borderSprite = new THREE.Sprite(borderMaterial)
    //   borderSprite.scale.copy(targetSprite.scale).multiplyScalar(1.3) // 比目标sprite略大
    //   borderSprite.position.copy(targetSprite.position)
    //   borderSprite.userData.isHighlightBorder = true

    //   // 5. 保证边框在sprite后面
    //   cameraGroup.add(borderSprite)
    // },
    // cancelHighlight(){
    //   cameraGroup.children.forEach((child) => {
    //     if (child.userData.isHighlightBorder) {
    //       cameraGroup.remove(child)
    //     }
    //   })
    // },
    getMapValue(value) {
      this.linkForm.linkMapId = value
    },
    getMapValue1(value) {
      this.markerForm.linkMapId = value
    },
    // handleRemove(file, fileList) {
    //   console.info(file, fileList)
    //   this.fileList = []
    //   this.markerForm.picUrl = ''
    // },
    confirmMarkerForm() {
      // if (this.fileList.length <= 0) {
      //   this.$message.error('请上传图片信息')
      //   return false
      // }
      this.$refs.markerForm.validate((valid) => {
        if (valid) {
          console.info('this.markerForm', this.markerForm)
          let markerFormData = JSON.parse(JSON.stringify(this.markerForm))
          if (this.isMarkerAdd == true) {
            let argData = {
              id: Date.now(),
              type: 'marker',
              name: this.markerForm.name,
              x: this.clickedPoint.x,
              y: this.clickedPoint.y,
              z: this.clickedPoint.z,
              // url: this.markerForm.picUrl,
              linkMapId: this.markerForm.linkMapId,
            }
            this.dataList.marker.push(argData)
            const texLoader1 = new THREE.TextureLoader()
            const texture1 = texLoader1.load(
              require('@/assets/images/kanas/label.png')
            )
            const spriteMaterial1 = new THREE.SpriteMaterial({
              map: texture1,
              transparent: true, //开启透明(纹理图片png有透明信息),
              depthTest: false,
              depthWrite: false,
            })
            spriteMaterial1.map.colorSpace = 'srgb'
            let sprite = new THREE.Sprite(spriteMaterial1)
            sprite.scale.set(0.3, 0.3, 0.3)
            sprite.position.set(
              this.clickedPoint.x,
              this.clickedPoint.y,
              this.clickedPoint.z
            )
            sprite.userData = argData
            markerGroup.add(sprite)
            this.createTextSprite(
              this.markerForm.name,
              this.clickedPoint.x,
              this.clickedPoint.y + 0.35,
              this.clickedPoint.z,
              'rgba(0, 0, 0, 0.5)',
              'white',
              14,
              argData.id
            )
            scene.add(markerGroup)
            this.isClickMarker = false
            this.handleMarkerClose()
          } else if (this.isMarkerAdd == false) {
            // 根据 this.rightClickedId 修改漫游点名称和关联的 VR 图
            const markerToUpdate = this.dataList.marker.find(
              (item) => item.id === this.rightClickedId
            )
            if (markerToUpdate) {
              // 更新数据
              markerToUpdate.name = markerFormData.name
              // markerToUpdate.picUrl = markerFormData.picUrl
              // markerToUpdate.url = markerFormData.picUrl
              markerToUpdate.linkMapId = markerFormData.linkMapId

              // 更新 markerGroup 中的图标
              const spriteToUpdate = markerGroup.children.find(
                (child) => child.userData.id === this.rightClickedId
              )
              if (spriteToUpdate) {
                spriteToUpdate.userData.name = markerFormData.name
                // spriteToUpdate.userData.picUrl = markerFormData.picUrl
                // spriteToUpdate.userData.url = markerFormData.picUrl
                spriteToUpdate.userData.linkMapId = markerFormData.linkMapId
              }

              // 更新 textGroup 中的标题
              const textToUpdate = textGroup.children.find(
                (child) =>
                  child.userData && child.userData.id === this.rightClickedId
              )
              if (textToUpdate) {
                // 删除旧的标题
                textGroup.remove(textToUpdate)
                textToUpdate.material.dispose()
                textToUpdate.geometry?.dispose()

                // 创建新的标题
                this.createTextSprite(
                  markerFormData.name,
                  spriteToUpdate.position.x,
                  spriteToUpdate.position.y + 0.35,
                  spriteToUpdate.position.z,
                  'rgba(0, 0, 0, 0.5)',
                  'white',
                  14,
                  this.rightClickedId
                )
              }
              console.info(this.dataList)
            } else {
              this.$message({
                type: 'error',
                message: '未找到对应的标注点',
              })
            }
            this.handleMarkerClose()
          }
        } else {
          return false
        }
      })
    },
    confirmLinkForm() {
      this.$refs.linkForm.validate((valid) => {
        if (valid) {
          console.info('this.linkForm', this.linkForm)

          if (this.isLinkAdd == true) {
            let argData = {
              id: Date.now(),
              type: 'link',
              name: this.linkForm.name,
              x: this.clickedPoint.x,
              y: this.clickedPoint.y,
              z: this.clickedPoint.z,
              linkMapId: this.linkForm.linkMapId,
            }
            this.dataList.link.push(argData)
            const texLoader1 = new THREE.TextureLoader()
            const texture1 = texLoader1.load(
              require('@/assets/images/kanas/link.png')
            )
            const spriteMaterial1 = new THREE.SpriteMaterial({
              map: texture1,
              transparent: true, //开启透明(纹理图片png有透明信息),
              depthTest: false,
              depthWrite: false,
            })
            spriteMaterial1.map.colorSpace = 'srgb'
            let sprite = new THREE.Sprite(spriteMaterial1)
            sprite.scale.set(0.3, 0.3, 0.3)
            sprite.position.set(
              this.clickedPoint.x,
              this.clickedPoint.y,
              this.clickedPoint.z
            )
            sprite.userData = argData
            linkGroup.add(sprite)
            this.createTextSprite(
              this.linkForm.name,
              this.clickedPoint.x,
              this.clickedPoint.y + 0.35,
              this.clickedPoint.z,
              'rgba(0, 0, 0, 0.5)',
              'white',
              14,
              argData.id
            )
            scene.add(linkGroup)
            this.isClickLink = false
            this.handleLinkClose()
          } else if (this.isLinkAdd == false) {
            // 根据 this.rightClickedId 修改漫游点名称和关联的 VR 图
            const linkToUpdate = this.dataList.link.find(
              (item) => item.id === this.rightClickedId
            )
            if (linkToUpdate) {
              // 更新数据
              linkToUpdate.name = this.linkForm.name
              linkToUpdate.linkMapId = this.linkForm.linkMapId

              // 更新 linkGroup 中的图标
              const spriteToUpdate = linkGroup.children.find(
                (child) => child.userData.id === this.rightClickedId
              )
              if (spriteToUpdate) {
                spriteToUpdate.userData.name = this.linkForm.name
                spriteToUpdate.userData.linkMapId = this.linkForm.linkMapId
              }

              // 更新 textGroup 中的标题
              const textToUpdate = textGroup.children.find(
                (child) =>
                  child.userData && child.userData.id === this.rightClickedId
              )
              if (textToUpdate) {
                // 删除旧的标题
                textGroup.remove(textToUpdate)
                textToUpdate.material.dispose()
                textToUpdate.geometry?.dispose()

                // 创建新的标题
                this.createTextSprite(
                  this.linkForm.name,
                  spriteToUpdate.position.x,
                  spriteToUpdate.position.y + 0.35,
                  spriteToUpdate.position.z,
                  'rgba(0, 0, 0, 0.5)',
                  'white',
                  14,
                  this.rightClickedId
                )
              }
              console.info(this.dataList)
            } else {
              this.$message({
                type: 'error',
                message: '未找到对应的漫游点',
              })
            }
            this.handleLinkClose()
          }
        } else {
          return false
        }
      })
    },
    // onchange(file, filelist) {
    //   var FileExt = file.name.replace(/.+\./, '')
    //   if (['jpg', 'png', 'jpeg'].indexOf(FileExt.toLowerCase()) === -1) {
    //     this.$message({
    //       type: 'error',
    //       message: '当前上传文件仅支持jpg、png、jpeg格式',
    //     })
    //     this.fileList = []
    //     return false
    //   }
    //   this.fileList = filelist
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning('最多上传1个文件')
    // },
    // onUploadSuccess(response, file, fileList) {
    //   if (response.code === 200) {
    //     const result = response.data
    //     console.info(result)
    //     this.markerForm.picUrl = result.path
    //     this.fileList = [{ name: fileList[0].name, url: result.path }]
    //   } else {
    //     this.$message.error('上传失败，请重新上传')
    //     this.$message.error(response.msg)
    //   }
    // },
    // beforeRemove(file, fileList) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       //执行删除操作
    //       this.deleteImgFn(file, fileList)
    //     })
    //     .catch(() => {})
    //   return false
    // },
    // deleteImgFn(file, fileList) {
    //   //请求后台删除接口，成功后将fileList中要删除的file移除
    //   this.fileList = []
    // },
    resetmarkerForm() {
      if (this.$refs.markerForm) {
        this.$refs.markerForm.resetFields()
      }
      // this.fileList = []
      this.markerForm.linkMapId = ''
      this.markerForm.name = ''
    },
    resetLinkForm() {
      if (this.$refs.linkForm) {
        this.$refs.linkForm.resetFields()
      }
      this.linkForm.name = ''
      this.linkForm.linkMapId = ''
    },
    handleMarkerClose() {
      this.resetmarkerForm()
      this.dialogMarkerVisible = false
    },
    handleLinkClose() {
      this.resetLinkForm()
      this.dialogLinkVisible = false
    },
    handleLinkDelete() {
      this.$confirm(`确定删除该漫游点吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //执行删除漫游点操作，删除漫游点图标，漫游点标题，更新this.dataList.link数据
          this.deleteLinkById(this.rightClickedId)
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除',
          // })
        })
      // this.resetLinkForm()
      // this.dialogLinkVisible = false
    },
    handleMarkerDelete() {
      this.$confirm(`确定删除该标注吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //执行删除漫游点操作，删除漫游点图标，漫游点标题，更新this.dataList.link数据
          this.deleteMarkerById(this.rightClickedId)
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除',
          // })
        })
      // this.resetLinkForm()
      // this.dialogLinkVisible = false
    },
    // 修改 init 方法，等待模型加载完成
    async init(row) {
      // 确保场景和核心对象存在
      if (!scene) {
        this.createScene()
      }
      if (!camera) {
        this.createCamera()
      }
      if (!renderer) {
        this.createRender()
      }
      if (!controls) {
        this.createControls()
      } else {
        controls.reset() // 重置控制器到默认状态
        controls.target.set(0, 0, 0) // 重置控制器目标点
        controls.update()
      }

      // 初始化射线检测器
      raycaster = new THREE.Raycaster()

      // 确保 Group 对象存在
      if (!cameraGroup) {
        cameraGroup = new THREE.Group()
      }
      if (!linkGroup) {
        linkGroup = new THREE.Group()
      }
      if (!markerGroup) {
        markerGroup = new THREE.Group()
      }
      if (!textGroup) {
        textGroup = new THREE.Group()
      }

      // 清空 Group 对象内容
      cameraGroup.clear()
      linkGroup.clear()
      markerGroup.clear()
      textGroup.clear()

      try {
        // 等待模型加载完成
        await this.createModel(row)
        // 创建点位和光源
        this.createPoint()
        this.createLight()
      } catch (error) {
        console.error('初始化失败:', error)
        return
      }

      // 开始渲染
      this.render()

      // 添加事件监听器
      const container = document.getElementById('vr-container')
      if (container) {
        container.addEventListener('click', this.onClick)
        container.addEventListener('contextmenu', this.rightClickEvent)
      }

      window.addEventListener('resize', this.onResize)
    },
    rightClickEvent(event) {
      // 阻止默认右键菜单弹出
      event.preventDefault()
      // 处理右键点击事件，判断右击了label、link还是marker
      // 获取鼠标在容器中的位置
      const container = document.getElementById('vr-container')
      const rect = container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // 从摄像机发出射线
      raycaster.setFromCamera(mouse, camera)

      // 检测与所有图标组的交点
      const intersects = raycaster.intersectObjects(
        [
          ...cameraGroup.children,
          ...linkGroup.children,
          ...markerGroup.children,
        ],
        true
      )

      if (intersects.length > 0) {
        // 获取第一个交点对象
        const intersectedObject = intersects[0].object

        // 获取图标的相关数据
        const userData = intersectedObject.userData
        console.info('右击的图标数据:', userData)

        // 判断图标类型
        if (cameraGroup.children.includes(intersectedObject)) {
          console.info('右击了相机图标')
          this.rightClickedId = userData.id // 记录右击的相机ID
          this.$confirm(`确定删除监控点-${userData.name}吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              //执行删除监控点操作，删除相机图标，相机标题，更新this.dataList.label数据
              this.deleteCamaraById(userData.id)
            })
            .catch(() => {
              // this.$message({
              //   type: 'info',
              //   message: '已取消删除',
              // })
            })
        } else if (linkGroup.children.includes(intersectedObject)) {
          // this.getLinkMapList()
          console.info('右击了漫游点图标')
          this.rightClickedId = userData.id // 记录右击的ID
          this.isLinkAdd = false // 设置为修改状态
          this.linkForm.name = userData.name // 设置漫游点名称
          this.linkForm.linkMapId = userData.linkMapId // 设置漫游点名称
          this.dialogLinkVisible = true
        } else if (markerGroup.children.includes(intersectedObject)) {
          console.info('右击了标注点图标')
          this.rightClickedId = userData.id // 记录右击的ID
          this.isMarkerAdd = false // 设置为修改状态
          this.markerForm.name = userData.name // 设置漫游点名称
          this.markerForm.linkMapId = userData.linkMapId // 设置漫游点名称
          // const imgPath = userData.url
          // const nameMatch = imgPath.match(/\/([^\/_]+)_[^\/]+(\.\w+)$/)
          // if (nameMatch) {
          //   this.fileList = [
          //     { name: nameMatch[1] + nameMatch[2], url: imgPath },
          //   ]
          // }
          this.dialogMarkerVisible = true
        }

        // 在这里可以根据需要执行其他操作，例如弹出菜单或显示详细信息
      } else {
        console.info('右击未命中任何图标')
      }
    },
    // 删除监控点的方法
    deleteCamaraById(id) {
      // 从 cameraGroup 中找到对应的图标并移除
      const cameraToRemove = cameraGroup.children.find(
        (child) => child.userData.id === id
      )
      if (cameraToRemove) {
        cameraGroup.remove(cameraToRemove) // 从组中移除
        cameraToRemove.material.dispose() // 释放材质
        cameraToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 textGroup 中找到对应的标题并移除
      const textToRemove = textGroup.children.find(
        (child) => child.userData && child.userData.id === id
      )
      if (textToRemove) {
        textGroup.remove(textToRemove) // 从组中移除
        textToRemove.material.dispose() // 释放材质
        textToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 dataList.label 中移除对应的数据
      const index = this.dataList.label.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.dataList.label.splice(index, 1) // 从数据列表中移除
      }

      // 打印日志确认删除
      // this.$message({
      //   type: 'success',
      //   message: `点位删除成功`,
      // })
    },
    // 删除漫游点的方法
    deleteLinkById(id) {
      // 从 linkGroup 中找到对应的图标并移除
      const linkToRemove = linkGroup.children.find(
        (child) => child.userData.id === id
      )
      if (linkToRemove) {
        linkGroup.remove(linkToRemove) // 从组中移除
        linkToRemove.material.dispose() // 释放材质
        linkToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 textGroup 中找到对应的标题并移除
      const textToRemove = textGroup.children.find(
        (child) => child.userData && child.userData.id === id
      )
      if (textToRemove) {
        textGroup.remove(textToRemove) // 从组中移除
        textToRemove.material.dispose() // 释放材质
        textToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 dataList.link 中移除对应的数据
      const index = this.dataList.link.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.dataList.link.splice(index, 1) // 从数据列表中移除
      }

      // 打印日志确认删除
      // this.$message({
      //   type: 'success',
      //   message: `点位删除成功`,
      // })
      this.handleLinkClose()
    },
    // 删除标注点的方法
    deleteMarkerById(id) {
      // 从 markerGroup 中找到对应的图标并移除
      const markerToRemove = markerGroup.children.find(
        (child) => child.userData.id === id
      )
      if (markerToRemove) {
        markerGroup.remove(markerToRemove) // 从组中移除
        markerToRemove.material.dispose() // 释放材质
        markerToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 textGroup 中找到对应的标题并移除
      const textToRemove = textGroup.children.find(
        (child) => child.userData && child.userData.id === id
      )
      if (textToRemove) {
        textGroup.remove(textToRemove) // 从组中移除
        textToRemove.material.dispose() // 释放材质
        textToRemove.geometry?.dispose() // 释放几何体（如果有）
      }

      // 从 dataList.marker 中移除对应的数据
      const index = this.dataList.marker.findIndex((item) => item.id === id)
      if (index !== -1) {
        this.dataList.marker.splice(index, 1) // 从数据列表中移除
      }

      // 打印日志确认删除
      // this.$message({
      //   type: 'success',
      //   message: `点位删除成功`,
      // })
      this.handleMarkerClose()
    },
    onResize() {
      // 更新摄像头
      camera.aspect = window.innerWidth / window.innerHeight
      //   更新摄像机的投影矩阵
      camera.updateProjectionMatrix()

      //   更新渲染器
      renderer.setSize(window.innerWidth, window.innerHeight)
      //   设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    },
    // 监听点击事件
    onClick(event) {
      event.preventDefault()
      // 获取点击位置的三维坐标利用射线检测
      console.log('this.isClickCamera', this.isClickCamera)
      console.log('this.isClickLink', this.isClickLink)
      console.log('this.isClickMarker', this.isClickMarker)
      const container = document.getElementById('vr-container')
      const rect = container.getBoundingClientRect() // 获取容器的尺寸和位置
      mouse = new THREE.Vector2()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster = new THREE.Raycaster()
      console.info('mouse', mouse),
        console.info('camera', camera),
        console.info('sphere', this.sphere)
      try {
        // 从摄像机发出射线
        raycaster.setFromCamera(mouse, camera)

        // 获取所有场景中的对象
        const intersects = raycaster.intersectObject(this.sphere, true)
        console.info('intersects', intersects)

        if (intersects.length > 0) {
          const intersect = intersects[0]
          const point = intersect.point
          console.info('点击了全景球体，三维坐标：', point)

          if (this.isClickCamera) {
            // 添加相机标签
            this.dataList.label.push({
              id: this.markerItem.id,
              type: 'camera',
              name: this.markerItem.name,
              x: point.x,
              y: point.y,
              z: point.z,
            })
            const texLoader1 = new THREE.TextureLoader()
            const texture1 = texLoader1.load(
              require('@/assets/images/kanas/control-camera-click.png')
            )
            const spriteMaterial1 = new THREE.SpriteMaterial({
              map: texture1,
              transparent: true, //开启透明(纹理图片png有透明信息),
              depthTest: false,
              depthWrite: false,
            })
            spriteMaterial1.map.colorSpace = 'srgb'
            let sprite = new THREE.Sprite(spriteMaterial1)
            sprite.scale.set(0.3, 0.3, 0.3)
            sprite.position.set(point.x, point.y, point.z)
            sprite.userData = Object.assign(point, {
              id: this.markerItem.id,
              type: 'camera',
              name: this.markerItem.name,
            })
            cameraGroup.add(sprite)
            this.createTextSprite(
              this.markerItem.name,
              point.x,
              point.y + 0.35,
              point.z,
              'rgba(0, 0, 0, 0.5)',
              'white',
              14,
              this.markerItem.id
            )
            scene.add(cameraGroup)
            this.isClickCamera = false
          } else if (this.isClickLink) {
            // 添加漫游标记
            this.clickedPoint = point
            this.isLinkAdd = true
            this.dialogLinkVisible = true
          } else if (this.isClickMarker) {
            // 添加标记信息
            this.clickedPoint = point
            this.isMarkerAdd = true
            this.dialogMarkerVisible = true
          }
        } else {
          console.info('没点到球体')
        }
      } catch (error) {
        console.error('射线检测失败:', error)
      }
    },
    getLinkMapList() {
      getMapTree('').then((res) => {
        this.linkMapList = res.data
      })
    },
    addLink() {
      this.isClickCamera = false
      this.isClickLink = true
      this.isClickMarker = false
      if (this.markerItem && this.markerItem.type == 'camera') {
        this.$emit('setCameraNull')
      }
    },
    addMarker() {
      this.isClickCamera = false
      this.isClickLink = false
      this.isClickMarker = true
      if (this.markerItem && this.markerItem.type == 'camera') {
        this.$emit('setCameraNull')
      }
    },
    // 创建文字Sprite的函数
    createTextSprite(
      text,
      x,
      y,
      z,
      bgColor = 'rgba(0, 0, 0, 0.5)',
      fontColor = 'white',
      fontSize,
      id
    ) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      context.font = `${fontSize}px Arial`
      const textWidth = context.measureText(text).width
      const padding = 10
      const canvasWidth = textWidth + padding * 2
      const canvasHeight = fontSize + padding * 1.2

      canvas.width = canvasWidth
      canvas.height = canvasHeight
      context.fillStyle = bgColor
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      context.fillStyle = fontColor
      context.font = `${fontSize}px Arial`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(text, canvasWidth / 2, canvasHeight / 2)

      const texture = new THREE.Texture(canvas)
      texture.needsUpdate = true

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
      spriteMaterial.map.colorSpace = 'srgb'
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(canvasWidth * 0.01, canvasHeight * 0.01, 1)
      sprite.position.set(x, y, z)
      // 设置 userData，包含 id
      sprite.userData = { id }
      textGroup.add(sprite)
      scene.add(textGroup)
    },
    saveDraw() {
      console.info('this.dataList', this.dataList)
      // this.dataList = {
      //   id: 'ad396f801e0d213d60c440734430b0be',
      //   name: 'test-前台',
      //   url: '/images/map/前台_1744247314507.jpg',
      //   link: [
      //     {
      //       id: 1744248992789,
      //       type: 'link',
      //       name: '大厅',
      //       x: -1.068429873608456,
      //       y: -0.8804340648351743,
      //       z: 4.7986900884207015,
      //       linkMapId: 'dd8ec4d56fae2408c8aab98983e5c022',
      //     },
      //   ],
      //   marker: [
      //     {
      //       id: 1744249073765,
      //       type: 'marker',
      //       name: '鱼缸',
      //       x: -4.08474951822839,
      //       y: -0.05246680816415389,
      //       z: 2.873579445368214,
      //       url: '/images/2025/4/10/鱼缸_1744249068215.jpg',
      //     },
      //   ],
      //   label: [
      //     {
      //       id: '44030501001320000035',
      //       type: 'camera',
      //       name: '站厅前台枪机88',
      //       x: 0.16001049924995742,
      //       y: 2.317914257963298,
      //       z: -4.421411509032787,
      //     },
      //   ],
      // }
      var jsonDataList = JSON.stringify(this.dataList);
      var jsonDataObject = JSON.parse(jsonDataList);
      var requestData = {
        labels: [
          {
            mapId: this.rowDetail.id,
            objectType: 'other',
            parameters: jsonDataList,
            shapeType: 1,
          },
        ],
        mapId: this.rowDetail.id,
      }
      if(jsonDataObject.label.length > 0){
        jsonDataObject.label.forEach(it=>{
          requestData.labels.push({
            mapId: this.rowDetail.id,
            objectType: 'camera',
            name:it.name,
            objectLinkId:it.id,
            parameters: jsonDataList,
            shapeType: 1,
          })
        })
      }
      addManyLabel(requestData).then((res) => {
        if (res.code == 200) {
          this.$message.success('保存成功')
          this.isClickCamera = false
          this.isClickLink = false
          this.isClickMarker = false
          this.handleLinkClose()
          this.handleMarkerClose()
          getMapLabelList(this.rowDetail.id).then((res) => {
            console.info('所有标签', res.data)
            if (res.data.length > 0) {
              this.dataList = JSON.parse(res.data[0].parameters)
            }
          })
        }
      })
    },
    createScene() {
      scene.background = new THREE.Color('#172333')
    },
    // 创建全景图背景
    // 修改 createModel 方法，添加 Promise 来确保纹理加载完成
    createModel(row) {
      return new Promise((resolve, reject) => {
        if (!row.url) {
          console.warn('全景图 URL 无效，无法加载 VR 图')
          reject('无效的 URL')
          return
        }
        let sphere_geometry = new THREE.SphereGeometry(5, 64, 64)
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(
          row.url,
          (texture) => {
            // 设置纹理的编码格式
            texture.encoding = THREE.sRGBEncoding
            // 设置各向异性过滤
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
            // 设置纹理的重复模式
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            // 设置纹理的过滤方式
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            this.sphereTexture = texture

            let sphere_material = new THREE.MeshStandardMaterial({
              map: this.sphereTexture,
              side: THREE.DoubleSide, // 双面渲染
            })
            sphere_material.map.colorSpace = 'srgb'
            sphere_geometry.scale(1, 1, -1)
            this.sphere = new THREE.Mesh(sphere_geometry, sphere_material)
            scene.add(this.sphere)
            resolve()
          },
          undefined,
          (error) => {
            console.error('加载全景图失败:', error)
            reject(error)
          }
        )
      })
    },
    // 创建监控点和漫游标记以及物品标记
    createPoint() {
      // 遍历监控点数据并创建
      if (this.dataList.label && this.dataList.label.length > 0) {
        this.dataList.label.forEach((label) => {
          const texLoader = new THREE.TextureLoader()
          const texture = texLoader.load(
            require('@/assets/images/kanas/control-camera-click.png')
          )
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          })
          spriteMaterial.map.colorSpace = 'srgb'
          const sprite = new THREE.Sprite(spriteMaterial)
          sprite.scale.set(0.3, 0.3, 0.3)
          sprite.position.set(label.x, label.y, label.z)
          sprite.userData = label // 将数据绑定到 userData
          cameraGroup.add(sprite)

          // 创建标题
          this.createTextSprite(
            label.name,
            label.x,
            label.y + 0.35,
            label.z,
            'rgba(0, 0, 0, 0.5)',
            'white',
            14,
            label.id
          )
        })
      }

      // 遍历漫游点数据并创建
      if (this.dataList.link && this.dataList.link.length > 0) {
        this.dataList.link.forEach((link) => {
          const texLoader = new THREE.TextureLoader()
          const texture = texLoader.load(
            require('@/assets/images/kanas/link.png')
          )
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          })
          spriteMaterial.map.colorSpace = 'srgb'
          const sprite = new THREE.Sprite(spriteMaterial)
          sprite.scale.set(0.3, 0.3, 0.3)
          sprite.position.set(link.x, link.y, link.z)
          sprite.userData = link // 将数据绑定到 userData
          linkGroup.add(sprite)

          // 创建标题
          this.createTextSprite(
            link.name,
            link.x,
            link.y + 0.35,
            link.z,
            'rgba(0, 0, 0, 0.5)',
            'white',
            14,
            link.id
          )
        })
      }

      // 遍历标注点数据并创建
      if (this.dataList.marker && this.dataList.marker.length > 0) {
        this.dataList.marker.forEach((marker) => {
          const texLoader = new THREE.TextureLoader()
          const texture = texLoader.load(
            require('@/assets/images/kanas/label.png')
          )
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
          })
          spriteMaterial.map.colorSpace = 'srgb'
          const sprite = new THREE.Sprite(spriteMaterial)
          sprite.scale.set(0.3, 0.3, 0.3)
          sprite.position.set(marker.x, marker.y, marker.z)
          sprite.userData = marker // 将数据绑定到 userData
          markerGroup.add(sprite)

          // 创建标题
          this.createTextSprite(
            marker.name,
            marker.x,
            marker.y + 0.35,
            marker.z,
            'rgba(0, 0, 0, 0.5)',
            'white',
            14,
            marker.id
          )
        })
      }

      // 将所有组添加到场景中
      scene.add(cameraGroup)
      scene.add(linkGroup)
      scene.add(markerGroup)
    },
    // 创建灯光
    createLight() {
      // 清除场景中已有的灯光
      const lights = scene.children.filter((child) => child.isLight)
      lights.forEach((light) => scene.remove(light))

      // 添加新的灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 2) // 创建环境光
      scene.add(ambientLight) // 将环境光添加到场景
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById('vr-container')
      const width = element.offsetWidth // 窗口宽度
      const height = element.offsetHeight // 窗口高度
      const k = width / height // 窗口宽高比
      camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)
      // camera.position.z = 3
      camera.position.set(
        initialCameraPosition.x,
        initialCameraPosition.y,
        initialCameraPosition.z
      )
      camera.rotation.set(0, 0, 0) // 重置旋转
      camera.lookAt(0, 0, 0) // 确保相机朝向场景中心
      scene.add(camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('vr-container')
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      element.appendChild(renderer.domElement)
    },
    // 创建控制器
    createControls() {
      controls = new OrbitControls(camera, renderer.domElement)
      // 初始控制器配置
      controls.enableDamping = true // 启用阻尼效果
      // controls.dampingFactor = 0.05;
      controls.minDistance = 1 // 最小缩放距离（球体半径2 + 安全距离1）
      controls.maxDistance = 5 // 最大缩放距离
      controls.enablePan = false // 禁用右键拖动
      // 反转鼠标拖动方向
      // controls.rotateSpeed = -0.4
      const originalRotate = controls.rotate;
      controls.rotate = (deltaX, deltaY) => {
        originalRotate.call(controls, deltaX, deltaY);
      };
    },
    // 渲染
    render() {
      if (this.renderId) {
        cancelAnimationFrame(this.renderId)
        this.renderId = null
      }
      // this.renderId = requestAnimationFrame(this.render)
      this.renderId = requestAnimationFrame(() => this.render())
      // TWEEN.update();
      // renderer.render(scene, camera)
      // 检查纹理是否加载完成
      if (
        this.sphereTexture &&
        this.sphereTexture.image &&
        this.sphereTexture.image.complete
      ) {
        renderer.render(scene, camera)
      }
      controls.update()
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      getMapLabelList(this.rowDetail.id).then((res) => {
        console.info('所有标签', res.data, this.rowDetail)
        if (res.data.length > 0) {
          this.dataList = JSON.parse(res.data[0].parameters)
          this.dataList.url = 'http://192.168.1.175:8090' + this.dataList.url
        } else {
          this.dataList = {
            id: this.rowDetail.id,
            name: this.rowDetail.name,
            // url: this.rowDetail.picUrl,
            url: 'http://192.168.1.175:8090' + this.rowDetail.picUrl,
            link: [],
            marker: [],
            label: [],
          }
        }
        console.info('this.dataList', this.dataList)
        // 初始化场景
        this.init(this.dataList)
        this.getLinkMapList()
      })
    })
  },
  beforeDestroy() {
    // 释放渲染器
    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement = null
      renderer = null
    }

    // 清空场景中的对象
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // 清空 Group 对象内容
    if (cameraGroup) cameraGroup.clear()
    if (linkGroup) linkGroup.clear()
    if (markerGroup) markerGroup.clear()
    if (textGroup) textGroup.clear()

    // 清空 dataList 数据
    this.dataList.marker = []
    this.dataList.link = []
    this.dataList.label = []

    // 释放纹理
    if (this.sphereTexture) {
      this.sphereTexture.dispose()
      this.sphereTexture = null
    }

    if (camera) {
      camera.position.set(0, 0, 3)
      camera.rotation.set(0, 0, 0)
      camera.updateProjectionMatrix()
    }

    // 释放控件
    if (controls) {
      controls.reset()
      controls.update()
      controls.dispose()
      controls = null
    }

    // 清空场景
    // scene.clear()
    // camera = null
    // sphere = null

    // 清空 sphere
    if (this.sphere) {
      scene.remove(this.sphere) // 从场景中移除
      if (this.sphere.geometry) this.sphere.geometry.dispose() // 释放几何体
      if (this.sphere.material) this.sphere.material.dispose() // 释放材质
      this.sphere = null
    }

    // 停止渲染循环
    if (this.renderId) {
      cancelAnimationFrame(this.renderId)
      this.renderId = null
    }

    // 移除事件监听器
    const container = document.getElementById('vr-container')
    if (container) {
      container.removeEventListener('click', this.onClick)
      container.removeEventListener('contextmenu', this.rightClickEvent)
    }
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style lang="scss" scoped>
#vr01 {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px dashed #ccc;
  border-color: var(--alarm-border);
  border-radius: 5px;

  .button-wrap {
    position: relative;
    z-index: 99;
    display: flex;
    justify-content: center;
    width: 100%;
    ::v-deep .el-button {
      &:hover {
        // background-color: #ecf4fe;
        background-color: #eeeeee;
        color: #4395f9;
      }
    }
  }
  #vr-container {
    width: 100%;
    height: calc(100% - 28px);
    border-radius: 5px;
  }
}

#my-modal {
  ::v-deep .el-dialog__header {
    background-color: #e3e3e3;
    padding: 3px 20px !important;
    height: 30px;
  }
  ::v-deep .el-input__inner {
    color: #000;
  }
  ::v-deep .el-dialog__header .el-dialog__title {
    line-height: 24px;
    font-size: 14px;
    color: #303133;
  }
  ::v-deep .el-dialog__header .el-dialog__headerbtn {
    top: 7px;
  }
  ::v-deep .el-dialog__header .el-dialog__close {
    color: #909399;
  }
  ::v-deep .el-dialog__body {
    background-color: #ffffff;
  }
}
#my-modal1 {
  ::v-deep .el-dialog__header {
    background-color: #e3e3e3;
    padding: 3px 20px !important;
    height: 30px;
  }
  ::v-deep .el-input__inner {
    color: #000;
  }
  ::v-deep .el-dialog__header .el-dialog__title {
    line-height: 24px;
    font-size: 14px;
    color: #303133;
  }
  ::v-deep .el-dialog__header .el-dialog__headerbtn {
    top: 7px;
  }
  ::v-deep .el-dialog__header .el-dialog__close {
    color: #909399;
  }
  ::v-deep .el-dialog__body {
    background-color: #ffffff;
  }
}
</style>
