<template>
  <div
    ref="container"
    style="position: relative; height: 100%"
    @click.capture="toggleClip"
  >
    <!-- <div class="search">
      <el-autocomplete
        class="inline-input"
        v-model.trim="state1"
        :fetch-suggestions="querySearch"
        placeholder="请输入搜索内容"
        @select="handleSelect"
      ></el-autocomplete>
    </div> -->
    <div
      class="tips-container"
      :style="!isSwapped ? scaledStyle2 : {}"
      v-if="alarmList.length > 0"
    >
      <div class="tips-text" v-if="alarmList.length > 1" @click="expandAlarm">
        <span>{{ alarmList.length }}</span
        >条未处理报警信息
        <i v-if="!isExpanded" class="el-icon-arrow-down" id="down"></i>
        <i v-else-if="isExpanded" class="el-icon-arrow-up" id="up"></i>
      </div>
      <div class="tips-loop">
        <div
          v-for="(item, index) in filteredAlarmList"
          :key="item.id"
          class="tips-item"
          @dblclick="toggleFontSize(item, index)"
          :style="{
            fontSize: activeIndex === index && isLarge ? '14px' : '12px',
          }"
        >
          <div
            style="
              overflow: hidden;
              white-space: nowrap;
              display: flex;
              align-items: center;
              height: 24px;
            "
            @click=""
          >
            <div
              style="
                width: 24px;
                height: 24px;
                margin-left: 60px;
                position: relative;
              "
            >
              <img
                src="@/assets/images/icon/alarm-light.png"
                alt=""
                style="width: 100%; height: 100%"
              />
            </div>
            <div style="flex: 1; margin-left: 20px">告警</div>
            <div style="flex: 6; margin-left: 20px">{{ item.alarmTime }}</div>
            <div style="flex: 1; margin-left: 20px">
              {{ alarmLevelDict[item.alarmLevel] }}
            </div>
            <div style="flex: 12; margin-left: 20px; max-width: 560px">
              {{ item.alarmObjName }} {{ item.alarmContext }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="canvas-container"
      :style="{
        width: canvasContainerWidth + 'px !important',
        height: canvasContainerHeight + 'px !important',
        position: 'absolute',
        left: left + leftOrigin + 'px !important',
        top: top + rightOrigin + 'px !important',
        zIndex: 99,
        transform: `scale(${tempScale})`,
        pointerEvents: 'none',
        transformOrigin: '0 0',
      }"
    >
      <canvas
        id="imgDom"
        :style="{
          width: canvasContainerWidth + 'px !important',
          height: canvasContainerHeight + 'px !important',
        }"
        v-show="showClip"
      ></canvas>
      <canvas
        id="tempCanvas"
        :style="{
          width: canvasContainerWidth + 'px !important',
          height: canvasContainerHeight + 'px !important',
          // transform: `translate(${leftOrigin}px, ${rightOrigin}px) scale(${tempScale})`,
          // transform: `scale(${tempScale})`,
          // transformOrigin: 'center center',
        }"
        v-show="showClip"
        @click="canvasClick()"
        @dblclick="canvasDbclick()"
        style="filter: drop-shadow(0px 0px 6px rgba(255, 0, 0, 1))"
      ></canvas>
      <canvas
        id="myCanvas"
        :style="{
          width: canvasContainerWidth + 'px !important',
          height: canvasContainerHeight + 'px !important',
        }"
      >
      </canvas>
      <!-- :style="hoverStyle" -->
    </div>
    <!-- <div id="button-container" v-show="showStationList">
      <el-button type="primary" size="mini" @click="goToLine()">车站</el-button>
      <el-button type="primary" size="mini" @click="goToVehicle()"
        >车载</el-button
      >
    </div> -->
    <div
      id="station-container"
      class="station-container"
      :style="!isSwapped ? scaledStyle3 : {}"
      v-show="showStationList"
    >
      <div class="station-wrapper">
        <div
          class="loop-container"
          v-for="(item, index) in stationList"
          :key="item.id"
        >
          <!-- <div class="circle" :class="{ 'circle-first': index == 0 }">
            <div
              class="circle-station"
              :class="{
                'active-circle': index === stationIndex,
                'active-gray': item.type === '1',
              }"
              :title="
                index !== stationIndex && item.type == '0'
                  ? '点击进入' + item.name
                  : ''
              "
              @click.stop="handleStationClick(item, index)"
            ></div>
            <div class="station-odd" v-if="index % 2 == 0">
              <el-tooltip
                v-if="index !== stationIndex && item.type == '0'"
                class="item"
                effect="dark"
                :content="'点击进入' + item.name"
                placement="bottom"
              >
                <span
                  @click.stop="handleStationClick(item, index)"
                  :class="{ 'active-font': index === stationIndex }"
                  >{{ item.name }}</span
                >
              </el-tooltip>
              <span
                v-else
                @click.stop="handleStationClick(item, index)"
                :class="{ 'active-font': index === stationIndex }"
                >{{ item.name }}</span
              >
            </div>
            <div class="station-even" v-else>
              <el-tooltip
                v-if="index !== stationIndex && item.type == '0'"
                class="item"
                effect="dark"
                :content="'点击进入' + item.name"
                placement="top"
              >
                <span
                  @click.stop="handleStationClick(item, index)"
                  :class="{ 'active-font': index === stationIndex }"
                  >{{ item.name }}</span
                >
              </el-tooltip>
              <span
                v-else
                @click.stop="handleStationClick(item, index)"
                :class="{ 'active-font': index === stationIndex }"
                >{{ item.name }}</span
              >
            </div>
          </div> -->
          <div class="circle" :class="{ 'circle-first': index == 0 }">
            <el-tooltip
              v-if="index !== stationIndex && item.type == '0'"
              class="item"
              effect="dark"
              :content="'点击进入' + item.name"
              placement="top"
            >
              <div
                class="circle-station"
                :class="{
                  'active-circle': index === stationIndex,
                  'active-gray': item.type === '1',
                }"
                @click.stop="handleStationClick(item, index)"
              ></div>
            </el-tooltip>
            <div
              v-else
              class="circle-station"
              :class="{
                'active-circle': index === stationIndex,
                'active-gray': item.type === '1',
              }"
              @click.stop="handleStationClick(item, index)"
            ></div>

            <div class="station-odd" v-if="index % 2 == 0">
              <el-tooltip
                v-if="index !== stationIndex && item.type == '0'"
                class="item"
                effect="dark"
                :content="'点击进入' + item.name"
                placement="top"
              >
                <span
                  @click.stop="handleStationClick(item, index)"
                  :class="{ 'active-font': index === stationIndex }"
                  >{{ item.name }}</span
                >
              </el-tooltip>
              <span
                v-else
                @click.stop="handleStationClick(item, index)"
                :class="{ 'active-font': index === stationIndex }"
                >{{ item.name }}</span
              >
            </div>
            <div class="station-even" v-else>
              <el-tooltip
                v-if="index !== stationIndex && item.type == '0'"
                class="item"
                effect="dark"
                :content="'点击进入' + item.name"
                placement="top"
              >
                <span
                  @click.stop="handleStationClick(item, index)"
                  :class="{ 'active-font': index === stationIndex }"
                  >{{ item.name }}</span
                >
              </el-tooltip>
              <span
                v-else
                @click.stop="handleStationClick(item, index)"
                :class="{ 'active-font': index === stationIndex }"
                >{{ item.name }}</span
              >
            </div>
          </div>

          <div class="line" v-if="index !== stationList.length - 1"></div>
        </div>
      </div>
    </div>
    <div
      class="map-name"
      v-show="toggleAllFloorList.length > 0"
      :style="[
        !isSwapped ? scaledStyle5 : {},
        {
          bottom:
            showStationList && showToggleFloor
              ? '175px'
              : showStationList && !showToggleFloor
              ? '65px'
              : !showStationList && showToggleFloor
              ? '110px'
              : '0',
        },
      ]"
      style="height: 30px; color: #fff; line-height: 30px; font-size: 12px"
    >
      <div
        style="
          width: 30px;
          height: 30px;
          background-color: rgba(2, 15, 24, 0.62);
        "
        title="场景切换"
      >
        <!-- {{ showToggleName }} -->
        <svg-icon
          icon-class="scene"
          style="width: 30px; height: 30px; cursor: pointer"
          @click="toggleImage"
        ></svg-icon>
      </div>
    </div>
    <div
      id="page-contaienr"
      v-show="showToggleFloor && toggleAllFloorList.length > 0"
      :style="[
        !isSwapped ? scaledStyle4 : {},
        { bottom: showStationList ? '65px' : '0' },
      ]"
    >
      <div
        style="
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(2, 15, 24, 0.62);
        "
      >
        <!-- 左箭头 -->
        <div class="left-arrow" @click="goToLeft">
          <i
            class="el-icon-arrow-left"
            style="font-size: 24px; color: #cccccc"
          ></i>
        </div>
        <!-- 图片区域包裹层 -->
        <div class="scroll-wrap">
          <div
            ref="scrollContent"
            style="display: flex; align-items: center; white-space: nowrap"
          >
            <div
              v-for="(item, index) in toggleAllFloorList"
              :key="index"
              style="flex-shrink: 0; position: relative"
            >
              <img
                v-if="index === showToggleIndex"
                :src="item.picUrl"
                :title="item.name"
                :alt="item.name"
                style="border: 2px solid #ffffff"
                class="map-picture"
                @click="goToDot(item, index)"
              />
              <img
                v-else
                :src="item.picUrl"
                :title="item.name"
                :alt="item.name"
                class="map-picture map-picture-unselected"
                @click="goToDot(item, index)"
              />
              <div
                class="vr-play-select"
                v-if="index === showToggleIndex && item.mapType == 2"
              ></div>
              <div
                class="vr-play-unselect"
                v-else-if="index !== showToggleIndex && item.mapType == 2"
              ></div>
            </div>
          </div>
        </div>
        <!-- 右箭头 -->
        <div class="right-arrow" @click="goToRight">
          <i
            class="el-icon-arrow-right"
            style="font-size: 24px; color: #cccccc"
          ></i>
        </div>
      </div>
    </div>
    <div
      id="map01"
      v-show="!show3D && !showVR"
      :style="{ background: backgroundColor }"
      ref="map"
    >
      <div id="right-top-btn" :style="!isSwapped ? scaledStyle1 : {}">
        <div
          id="goResize"
          class="resize"
          @click="goResize()"
          :class="activeOne ? 'bg-yellow' : ''"
          title="返回初始状态"
          v-show="!show3D"
        ></div>
        <div
          id="backModel"
          class="model"
          @click="backModel()"
          :class="activeFive ? 'bg-yellow' : ''"
          title="返回"
          v-show="show3D"
        ></div>
        <div
          id="goToggleDevice"
          class="hide-name"
          :class="{
            'hide-eye': displayName,
            'show-eye': !displayName,
            'bg-yellow': activeTwo,
          }"
          @click="goToggleDevice()"
          :title="displayName == true ? '隐藏设备名称' : '显示设备名称'"
          v-show="!show3D"
        ></div>
        <div
          id="goSelect"
          class="select"
          @click="goSelect()"
          :class="activeFour ? 'bg-yellow' : ''"
          title="框选打开视频"
          v-show="!show3D"
        ></div>
        <div
          id="goBack"
          class="back"
          @click="goBack()"
          :class="activeThree ? 'bg-yellow' : ''"
          title="返回上级"
          v-show="hasBack && !show3D"
        ></div>
      </div>
      <section
        v-show="
          layoutType == 'default' && !isChange && !hidenLeftPanel && false
        "
        class="panel-left-container"
      >
        <transition
          enter-active-class="animate__fadeInLeft"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutLeft"
          v-if="isShow1"
        >
          <data-panel
            class="left"
            :sysResourceId="sysResourceId"
            :showRight="false"
            @changeToShowData="changeToShowData"
          ></data-panel>
        </transition>

        <section v-if="isShow1" @click="isShow1 = false">
          <section class="isShow1">
            <img :src="toLeft" alt="" />
          </section>
          <section class="isShowOne1">
            <img :src="toLeft" alt="" />
          </section>
        </section>
        <section v-if="!isShow1" @click="isShow1 = true">
          <section class="disShow1">
            <img :src="toRight" alt="" />
          </section>
          <section class="disShowOne1">
            <img :src="toRight" alt="" />
          </section>
        </section>
      </section>
      <!-- 默认布局 -->
      <section
        v-show="
          layoutType == 'default' && !isChange && !hidenRightPanel && false
        "
        class="panel-right-container"
      >
        <transition
          enter-active-class="animate__fadeInRight"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutRight"
          v-if="isShow"
        >
          <data-panel
            class="right"
            :sysResourceId="sysResourceId"
            :showRight="true"
            @changeToShowData="changeToShowData"
          ></data-panel>
        </transition>

        <section v-if="isShow" @click="isShow = false">
          <section class="isShow">
            <img :src="toRight" alt="" />
          </section>
          <section class="isShowOne">
            <img :src="toRight" alt="" />
          </section>
        </section>
        <section v-if="!isShow" @click="isShow = true">
          <section class="disShow">
            <img :src="toLeft" alt="" />
          </section>
          <section class="disShowOne">
            <img :src="toLeft" alt="" />
          </section>
        </section>
      </section>

      <!-- 数据布局 -->
      <section v-if="layoutType == 'data' && false" class="show-data">
        <transition
          enter-active-class="animate__fadeInRight"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutRight"
          v-if="isChange"
        >
          <section class="top-bar">
            <section class="detail-button" @click="changeToMap">
              <!-- <i class="el-icon-menu"></i> -->
              <img src="@/assets/images/icon/close1.png" alt="" />
            </section>
          </section>
        </transition>
        <transition
          enter-active-class="animate__fadeIn"
          name="animate__animated animate__bounce"
          leave-active-class="animate__fadeOut"
          v-if="isChange"
        >
          <section class="content">
            <section
              :title="item.title"
              :haveBack="true"
              class="item"
              v-for="(item, index) in showList"
              :key="index"
            >
              <component
                :id="item.component + Math.round(Math.random() * 10)"
                :is="item.component"
                :width="'100%'"
                :height="'100%'"
              ></component>
            </section>
          </section>
        </transition>
      </section>
    </div>
    <div
      id="vr01"
      v-if="!show3D && showVR"
      :style="{ background: backgroundColor }"
      ref="map"
    >
      <div id="right-top-btn" :style="!isSwapped ? scaledStyle1 : {}">
        <div
          id="goResize"
          class="resize"
          @click="goResize()"
          :class="activeOne ? 'bg-yellow' : ''"
          title="返回初始状态"
        ></div>
        <div
          id="goBack"
          class="back"
          @click="goBack()"
          :class="activeThree ? 'bg-yellow' : ''"
          title="返回上级"
          v-show="hasBack"
        ></div>
      </div>
      <div
        class="thumb-box"
        :style="!isSwapped ? scaledStyle1 : {}"
        v-show="showVR && thumbImg"
      >
        <img :src="thumbImg" class="thumb-img" alt="" />
        <div
          class="rotate-contaienr"
          v-if="showVR && thumbImg && thumby && thumbx"
        >
          <img
            class="thumb-point"
            :src="pointImg"
            :style="{
              top: `calc(${thumby * 100}% - 10px)`,
              left: `calc(${thumbx * 100}% - 10px)`,
              transform: `rotate(${currentRotZ ? Number(currentRotZ) : 0}deg)`,
            }"
            :title="'当前位置为' + thumbName"
            alt=""
          />
          <img
            class="marker-point"
            :src="markerImg"
            alt=""
            v-for="item in markerList"
            :key="item.id"
            :style="{
              top: `calc(${item.thumby * 100}% - 8px)`,
              left: `calc(${item.thumbx * 100}% - 8px)`,
            }"
            :title="'点击进入' + item.name"
            @click="goToMarker(item)"
          />
        </div>
      </div>
      <section
        v-show="layoutType == 'default' && !isChange && !hidenLeftPanel"
        class="panel-left-container"
      >
        <transition
          enter-active-class="animate__fadeInLeft"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutLeft"
          v-if="isShow1"
        >
          <data-panel
            class="left"
            :sysResourceId="sysResourceId"
            :showRight="false"
            @changeToShowData="changeToShowData"
          ></data-panel>
        </transition>

        <section v-if="isShow1" @click="isShow1 = false">
          <section class="isShow1">
            <img :src="toLeft" alt="" />
          </section>
          <section class="isShowOne1">
            <img :src="toLeft" alt="" />
          </section>
        </section>
        <section v-if="!isShow1" @click="isShow1 = true">
          <section class="disShow1">
            <img :src="toRight" alt="" />
          </section>
          <section class="disShowOne1">
            <img :src="toRight" alt="" />
          </section>
        </section>
      </section>
      <!-- 默认布局 -->
      <section
        v-show="layoutType == 'default' && !isChange && !hidenRightPanel"
        class="panel-right-container"
      >
        <transition
          enter-active-class="animate__fadeInRight"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutRight"
          v-if="isShow"
        >
          <data-panel
            class="right"
            :sysResourceId="sysResourceId"
            :showRight="true"
            @changeToShowData="changeToShowData"
          ></data-panel>
        </transition>

        <section v-if="isShow" @click="isShow = false">
          <section class="isShow">
            <img :src="toRight" alt="" />
          </section>
          <section class="isShowOne">
            <img :src="toRight" alt="" />
          </section>
        </section>
        <section v-if="!isShow" @click="isShow = true">
          <section class="disShow">
            <img :src="toLeft" alt="" />
          </section>
          <section class="disShowOne">
            <img :src="toLeft" alt="" />
          </section>
        </section>
      </section>

      <!-- 数据布局 -->
      <section v-if="layoutType == 'data'" class="show-data">
        <transition
          enter-active-class="animate__fadeInRight"
          name="animate__animated animate__bounce"
          appear
          leave-active-class="animate__fadeOutRight"
          v-if="isChange"
        >
          <section class="top-bar">
            <section class="detail-button" @click="changeToMap">
              <!-- <i class="el-icon-menu"></i> -->
              <img src="@/assets/images/icon/close1.png" alt="" />
            </section>
          </section>
        </transition>
        <transition
          enter-active-class="animate__fadeIn"
          name="animate__animated animate__bounce"
          leave-active-class="animate__fadeOut"
          v-if="isChange"
        >
          <section class="content">
            <section
              :title="item.title"
              :haveBack="true"
              class="item"
              v-for="(item, index) in showList"
              :key="index"
            >
              <component
                :id="item.component + Math.round(Math.random() * 10)"
                :is="item.component"
                :width="'100%'"
                :height="'100%'"
              ></component>
            </section>
          </section>
        </transition>
      </section>
    </div>
    <div id="cesium01" v-show="show3D"></div>
    <el-dialog
      class="doorDailog"
      :visible.sync="doorVisible"
      width="178px"
      :before-close="doorClose"
    >
      <section class="control">
        <section>
          <el-button type="primary" size="mini"
            ><i class="el-icon-unlock"></i> 开 门</el-button
          >
        </section>
        <section>
          <el-button type="primary" style="margin-top: 6px" size="mini"
            ><i class="el-icon-lock"></i> 关 门</el-button
          >
        </section>
      </section>

      <div class="door-close" @click="doorClose">
        <img src="@/assets/images/icon/close.png" alt="" />
      </div>
    </el-dialog>

    <el-dialog
      class="doorDailog"
      :visible.sync="defenceVisible"
      width="178px"
      :before-close="defenceClose"
    >
      <section class="control">
        <section>
          <el-button type="primary" size="mini"
            ><i class="el-icon-unlock"></i> 布 防</el-button
          >
        </section>
        <section>
          <el-button type="primary" style="margin-top: 6px" size="mini"
            ><i class="el-icon-lock"></i> 撤 防</el-button
          >
        </section>
      </section>

      <div class="door-close" @click="defenceClose">
        <img src="@/assets/images/icon/close.png" alt="" />
      </div>
    </el-dialog>

    <!-- <el-image-viewer
      v-if="dialogImageVisible"
      :url-list="previewImageList"
      hide-on-click-modal
      teleported
      :on-close="handleCloseImage"
      class="my-image-viewer"
    ></el-image-viewer> -->
    <realVideo
      ref="realVideoRef"
      width="50%"
      height="70%"
      top="150px"
      zIndex="9999"
      :dialogVisible="realDialogVisible"
      @handleClose="handleCloseCamera"
    ></realVideo>
  </div>
</template>

<script>
function debounce(func, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
import * as THREE from 'three'
// import TWEEN from 'tween.js'
// import moment from 'moment'
import { gsap } from 'gsap'
// import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 定义场景
const scene = new THREE.Scene()
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls
var camera
var renderer
var raycaster
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
//引入数据面板
import dataPanel from '@/components/ShowData/data-panel/index.vue'
// 引入视频监控组件

//引入封装后的组件
import generalSituation from '@/components/ShowData/general-situation/index.vue'
import dutyInfo from '@/components/ShowData/duty-info/index.vue'
import onlineRank from '@/components/ShowData/online-rank/index.vue'
import securityFacilities from '@/components/ShowData/security-facilities/index.vue'
import yesterdayAlarm from '@/components/ShowData/yesterday-alarm/index.vue'
import monthSecurity from '@/components/ShowData/month-security/index.vue'
import monthAlarm from '@/components/ShowData/month-alarm/index.vue'
import alarmTrend from '@/components/ShowData/alarm-trend/index.vue'
import peoplePercent from '@/components/ShowData/people-percent/index.vue'
import videoMonitors from '@/components/ShowData/video-monitors/index.vue'
import systemOperations from '@/components/ShowData/system-operations/index.vue'
import onlineCondition from '@/components/ShowData/online-condition/index.vue'
import alarmInfo from '@/components/ShowData/alarm-info/index.vue'
import alarmStatistics from '@/components/ShowData/alarm-statistics/index.vue'
import yearStatistic from '@/components/ShowData/year-statistic/index.vue'
import levelStatistic from '@/components/ShowData/level-statistic/index.vue'
import realVideo from './components/real-video/index.vue'
// import videoMonitor from '@/components/video-monitor/index.vue'
import AILabel from 'ailabel'
import qs from 'qs'
import flvjs from 'flv.js'
import {
  createMap1,
  addDeleteIcon,
  addFeature,
  addTargetRect,
  addImage1,
  addFeatureLayer,
  addTextLayer,
  setDrawingStyle,
  revoke,
  deleteText,
  getAllFeatures,
  getText,
  mouseOver,
  mouseOut,
  deleteAllMarkers,
} from '@/utils/ailabelShow'

import {
  // addMapLabelList,
  addManyLabel,
  getAllMap,
  getMapLabelList,
  getPeerRegion,
  getDeviceInfo,
  getTemplateList,
  getMenuByType,
  getTemplateById,
  getAlarmLabel,
  getRegionList,
  getLineTree,
  getTopMap,
  getStationById,
  getMapByPage,
  getBackByMapId,
  getLineMap,
  getMapByDeviceId,
  getMapByKeyword,
  getMapTree,
  getResourceGroupData,
  getSysSetting,
} from '@/api/system-manager'

// 引入过度动画
import 'animate.css'
import { getRealtimeAlarmList, getLiveUrls } from '@/api/alarm-manager'
import { getTodayList } from '@/api/duty-manager'
import { getMapId } from '@/api/user-manager'

// import { getUrls } from "@/api/alarm-manager"
import Thumbnail from './thumbnail'

export default {
  name: 'modal',
  components: {
    // ElImageViewer,
    Thumbnail,
    dataPanel,
    // videoMonitor
    generalSituation,
    dutyInfo,
    onlineRank,
    securityFacilities,
    yesterdayAlarm,
    monthSecurity,
    monthAlarm,
    alarmTrend,
    peoplePercent,
    videoMonitors,
    systemOperations,
    onlineCondition,
    alarmInfo,
    alarmStatistics,
    yearStatistic,
    levelStatistic,
    realVideo,
  },
  props: {
    isSwapped: {
      type: Boolean,
      default: false,
    },
    currentCameraId: {
      type: String,
      default: '',
    },
    // savedList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    //   required: true,
    // },
    // objId: {
    //   type: String,
    //   default: "",
    //   required: true,
    // },
  },
  inject: ['actionsConfig', 'toOpenCamera'],
  watch: {
    actionChange(val) {
      var that = this
      console.log('*****报警*******', val)
      if (val && val.actions && val.actions.length > 0) {
        // 跳转逻辑
        var valActions = val.actions
        valActions = valActions.filter((it) => it.actionCode == 'ac005')
        if (valActions.length > 0) {
          // 跳转逻辑
          console.log(valActions[0].actionObjId, '新增报警设备的id') //跳转并聚焦要用到
          let queryData = qs.stringify({
            objectId: valActions[0].actionObjId,
            regionId: '',
          })
          getMapByDeviceId(queryData).then((res111) => {
            if (res111.data.length > 0) {
              var positionParameters = JSON.parse(
                res111.data[0].labels.find(
                  (it) => it.objectLinkId == valActions[0].actionObjId
                ).parameters
              )
              // that.gMap.markerLayer.removeAllMarkers()
              // that.textLayer.removeAllTexts()
              // that.featureLayer.removeAllFeatures()
              // that.gMap.removeLayerById("first-layer-image")
              // that.operateList.push(res111.data[0])
              // sessionStorage.setItem("mapHistory", JSON.stringify(that.operateList))
              if (res111.data[0].id == that.currentMapId) {
                // 是当前图，只定位
                that.updateAnimation(res111.data[0].id, positionParameters[0])
              } else {
                that.gMap && that.gMap.markerLayer.removeAllMarkers()
                that.textLayer && that.textLayer.removeAllTexts()
                that.featureLayer && that.featureLayer.removeAllFeatures()
                that.gMap && that.gMap.removeLayerById('first-layer-image')
                that.operateList.push(res111.data[0])
                sessionStorage.setItem(
                  'mapHistory',
                  JSON.stringify(that.operateList)
                )
                // 非当前图，跳转后再定位
                that.imgUrl = res111.data[0].picUrl
                // that.imgUrl = 'http://192.168.1.175:8090' + res111.data[0].picUrl
                that.initMap(
                  res111.data[0].id,
                  res111.data[0],
                  res111.data[0].id,
                  positionParameters[0]
                )
              }
            } else {
              var routeQueryId = ''
              if (that.operateList[that.operateList.length - 1].objLinkId) {
                routeQueryId =
                  that.operateList[that.operateList.length - 1].objectLinkId
              } else {
                routeQueryId = that.operateList[that.operateList.length - 1].id
              }
              getAlarmLabel(routeQueryId).then((res1) => {
                console.log(res1.data, '报警闪烁数据')
                that.deviceList = []
                that.polyList = []
                res1.data.forEach((item) => {
                  console.log(item, that.savedJsonList)
                  let temporaryList = that.savedJsonList.filter(
                    (items) =>
                      items.id === item &&
                      (items.shapeType == 3 || items.shapeType == 5)
                  )
                  console.log(temporaryList)
                  if (temporaryList.length > 0) {
                    //多边形闪烁
                    that.polyList.push(JSON.parse(temporaryList[0].parameters))
                  }
                })
                //设备水波纹扩散
                let data1 = {
                  current: 1,
                  size: -1,
                  alarmLevel: '',
                  objectType: [],
                  // regionId: [],
                  regionId: null,
                }
                getRealtimeAlarmList(data1).then((res2) => {
                  that.alarmList = res2.data.records
                  res2.data.records.forEach((ite) => {
                    let alarmObjId = ite.alarmObjId
                    let tempFindList = that.savedJsonList.find(
                      (it) => it.shapeType == 1 && it.objectLinkId == alarmObjId
                    )
                    if (tempFindList.length > 0) {
                      that.deviceList.push(tempFindList)
                    }
                  })
                  setTimeout(function () {
                    that.setCanvas()
                  }, 100)
                })
              })
            }
          })
          // 待添加
        } else {
          console.log(that.operateList)
          var routeQueryId = ''
          if (that.operateList[that.operateList.length - 1].objLinkId) {
            routeQueryId =
              that.operateList[that.operateList.length - 1].objectLinkId
          } else {
            routeQueryId = that.operateList[that.operateList.length - 1].id
          }
          getAlarmLabel(routeQueryId).then((res1) => {
            console.log(res1.data, '报警闪烁数据')
            that.deviceList = []
            that.polyList = []
            res1.data.forEach((item) => {
              console.log(item, that.savedJsonList)
              let temporaryList = that.savedJsonList.filter(
                (items) =>
                  items.id === item &&
                  (items.shapeType == 3 || items.shapeType == 5)
              )
              console.log(temporaryList)
              if (temporaryList.length > 0) {
                //多边形闪烁
                that.polyList.push(JSON.parse(temporaryList[0].parameters))
              }
            })
            //设备水波纹扩散
            let data1 = {
              current: 1,
              size: -1,
              alarmLevel: '',
              objectType: [],
              // regionId: [],
              regionId: null,
            }
            getRealtimeAlarmList(data1).then((res2) => {
              that.alarmList = res2.data.records
              res2.data.records.forEach((ite) => {
                let alarmObjId = ite.alarmObjId
                let tempFindList1 = that.savedJsonList.find(
                  (it) => it.shapeType == 1 && it.objectLinkId == alarmObjId
                )
                if (tempFindList1) {
                  that.deviceList.push(tempFindList1)
                }
              })
              setTimeout(function () {
                that.setCanvas()
              }, 100)
            })
          })
        }
      } else if (val && val.action == 'PULL') {
        console.log(that.operateList)
        var routeQueryId = ''
        if (that.operateList[that.operateList.length - 1].objLinkId) {
          routeQueryId =
            that.operateList[that.operateList.length - 1].objectLinkId
        } else {
          routeQueryId = that.operateList[that.operateList.length - 1].id
        }
        getAlarmLabel(routeQueryId).then((res1) => {
          console.log(res1.data, '报警闪烁数据')
          that.deviceList = []
          that.polyList = []
          that.vrList = []
          res1.data.forEach((item) => {
            console.log(item, that.savedJsonList)
            let temporaryList = that.savedJsonList.filter(
              (items) =>
                items.id === item &&
                (items.shapeType == 3 || items.shapeType == 5)
            )
            console.log(temporaryList)
            if (temporaryList.length > 0) {
              //多边形闪烁
              that.polyList.push(JSON.parse(temporaryList[0].parameters))
            }
          })
          //设备水波纹扩散
          let data1 = {
            current: 1,
            size: -1,
            alarmLevel: '',
            objectType: [],
            // regionId: [],
            regionId: null,
          }
          getRealtimeAlarmList(data1).then((res2) => {
            that.alarmList = res2.data.records
            res2.data.records.forEach((ite) => {
              let alarmObjId = ite.alarmObjId
              let tempFindList = that.dataList.label.find(
                (it) => it.id == alarmObjId
              )
              if (tempFindList) {
                that.vrList.push(tempFindList.id)
              }
              let tempFindList1 = that.savedJsonList.find(
                (it) => it.shapeType == 1 && it.objectLinkId == alarmObjId
              )
              if (tempFindList1) {
                that.deviceList.push(tempFindList1)
              }
            })
            console.log('当前VR页面报警设备数组', that.vrList)
            setTimeout(function () {
              that.setCanvas()
            }, 100)
          })
        })
      }
    },
    vrList: {
      handler(newList) {
        // 新增的报警
        newList.forEach((cameraId) => {
          if (!this.cameraAlarmEffects[cameraId]) {
            this.setCameraAlarm(cameraId)
          }
        })
        // 已移除的报警
        Object.keys(this.cameraAlarmEffects).forEach((cameraId) => {
          if (!newList.includes(cameraId)) {
            this.clearCameraAlarm(cameraId)
          }
        })
      },
      immediate: true,
      deep: true,
    },
    currentScale(val) {
      var that = this
      // setTimeout(function () {
      that.gMap && that.setCanvas()
      // }, 100)
    },
    currentZoom(val) {
      var that = this
      // setTimeout(function () {
      that.gMap && that.setCanvas()
      // }, 100)
    },
    currentCenter(val) {
      var that = this
      // setTimeout(function () {
      that.gMap && that.setCanvas()
      // }, 100)
    },
    // currentCameraId(val) {
    //   if (val !== '') {
    //     console.info('-------------------当前摄像头ID--------------:', val)
    //     // 打印当前时间
    //     console.info('当前时间:', moment().format('YYYY-MM-DD HH:mm:ss'))
    //     this.setCameraCenter(val)
    //   }
    // },
  },
  computed: {
    scaledStyle1() {
      return {
        transform: 'scale(0.25)',
        transformOrigin: 'right top',
      }
    },
    scaledStyle2() {
      return {
        transform: 'translateX(-50%) scale(0.25)',
        transformOrigin: 'center top',
      }
    },
    scaledStyle3() {
      return {
        width: '400%',
        transform: 'scale(0.25)',
        transformOrigin: 'left bottom',
      }
    },
    scaledStyle4() {
      return {
        width: '400%',
        transform: 'scale(0.25)',
        transformOrigin: '0px 175.2px',
      }
    },
    scaledStyle5() {
      return {
        width: '400%',
        transform: 'scale(0.25)',
        transformOrigin: '0px 205.4px',
      }
    },
    actionChange() {
      return this.actionsConfig()
    },
    // routeId () {
    //   return this.$route.query.id || new Date().getTime()
    // },
    filteredAlarmList() {
      if (this.isExpanded) {
        return this.alarmList
      } else {
        if (this.alarmList.length == 1) {
          return [this.alarmList[0]]
        } else return []
      }
    },
  },
  data() {
    return {
      enableEnvironment: false,
      environmentId: '',
      realCameraId: '',
      currentUrlRealUrl: '',
      // 图片预览
      // dialogImageVisible: false,
      // prpreviewImageListviewList: [],
      thumbx: '',
      thumby: '',
      thumbName: '',
      currentRotZ: '0',
      thumbImg: '',
      // thumbImg: require('@/assets/images/capture.jpg'),
      pointImg: require('@/assets/images/point.png'),
      markerImg: require('@/assets/images/marker.png'),
      dataList: {
        id: '',
        name: '',
        url: '',
        marker: [], // 标注点数据
        link: [], // 漫游点数据
        label: [], // 监控点数据
      },
      sphere: null,
      sphereTexture: null,
      renderId: null,
      viewer: null,
      show3D: false,
      showVR: false,
      hasBack: false,
      allCameraMarkers: [],
      selectedCameraMarkers: [],
      activeOne: false,
      activeTwo: false,
      activeThree: false,
      activeFour: false,
      activeFive: false,
      // state1: '',
      hidenLeftPanel: false,
      hidenRightPanel: false,
      sysResourceId: '',
      targetFeature: null,
      isLarge: false, // 初始状态为不是大字体
      activeIndex: null, // 激活的项索引
      alarmLevelDict: {
        1: '一级',
        2: '二级',
        3: '三级',
      },
      listInfo: null,
      isExpanded: false,
      alarmList: [],
      currentMapId: '',
      // displayName: true,
      displayName: false,
      // displayPolygonName: false,
      animationFrameId: null,
      rippleAnimationId: null,
      debounceTimeout1: null,
      debounceTimeout2: null,
      debounceTimeout3: null,
      // debounceTimeout4: null,
      debounceTimeout5: null,
      intervalId: null,
      // svgImageUrl: 'http://192.168.1.175:8090/images/map/imetro_1705895004294.svg',
      firstPosition: {
        x: '',
        y: '',
      },
      currentScale: 1,
      currentZoom: 1,
      currentCenter: {
        x: '',
        y: '',
      },
      tempScale: 1,
      leftOrigin: '',
      rightOrigin: '',
      firstScale: '',
      regionData: [],
      operateList: [],
      levelList: [],
      jumpList: {},
      topMapData: {},
      scaleFactor: 1,
      showBack: true,
      lineId: '',
      lineTreeData: [],
      lineTreeArray: [],
      showStationList: false,
      regionList: [],
      stationIndex: -1,
      stationList: [],
      // 报警设备-动画
      deviceList: [],
      // 多边形-动画
      polyList: [],
      vrList: [],
      cameraAlarmEffects: {}, // 记录每个报警摄像头动画sprite
      animationId: '',
      mapId: '',
      toggleAllFloorList: [],
      showToggleFloor: false,
      showToggleIndex: 0,
      showToggleName: '',
      left: 0,
      top: 0,
      picWidth: 0,
      picHeight: 0,
      mapWidth: 0,
      mapHeight: 0,
      containerWidth: 0,
      containerHeight: 0,
      canvasContainerWidth: 0,
      canvasContainerHeight: 0,
      ripples: [],
      showList: [],
      markerList: [],
      // backgroundPoints: [{ id: 'dasaf13321', x: 1502.4099318403116, y: 369.60077896786754 }],
      backgroundPoints: [],
      showClip: false,
      // isShow: true,
      toLeft: require('../../../assets/images/map/toLeft.png'),
      toRight: require('../../../assets/images/map/toRight.png'),
      backId: '',
      cameraObj: {}, //记录双击打开的摄像头
      flvPlayer: null,
      src: '',
      cameraVisible: false,
      doorVisible: false,
      defenceVisible: false,
      savedJsonList: [],
      mapList: [],
      // markeredItem: {},
      gMap: null,
      featureLayer: null,
      textLayer: null,
      allFeatures: null,
      allTexts: null,
      mode: '',
      deleteUrl: './static/delete.png',
      // imgUrl: "./static/map01.png",
      imgUrl: '',
      // markerUrl: "./static/camera.png",
      markerUrl: './static/icon-camera.png',
      markerHoverUrl: './static/camera_hover.png',
      targetUrl: './static/target.png',
      revoke,
      index: 0,
      command: '',
      menuVisible: false,
      rightMenuStyle: {
        top: 0,
        left: 0,
      },
      cameraInfo: null,
      featureInfo: null,
      targetFeatureId: null,
      targetFeature: null,
      formLink: {
        test: {
          type: 'map',
          id: '',
          // note: "",
        },
      },
      lastId: '',
      lastIdCamera: '',
      tempList1: [],
      linkedList: {},
      // linkedListCamera: {},
      backFlag: false,
      visible: false,
      visiblePlayer: false,
      visibleFeature: false,
      workInfo: {
        title: '值班信息',
        jobInfo: [],
      },
      // 是否展示数据面板
      isShow: true,
      isShow1: true,
      isChange: false,
      layoutType: 'default',
      // 容器背景
      // backgroundColor: 'rgba(0,31,62)'
      backgroundColor: 'rgba(22,22,22)',
      configForm: {
        setBackground: true,
        backgroundColor: '#0A72D1',
        fontColor: '#DFDFDF',
      },
      configData: {},
      extension: {},
      realDialogVisible: false,
    }
  },
  created() {
    var that = this
    // getMenuByType(1).then((res1) => {
    //   let id = res1.data.find(it=>it.url == this.$route.path).id
    //   this.sysResourceId = id
    //   that.getTemplateData()
    // })

    getSysSetting('mapConfig').then((res) => {
      if (res.code == 200) {
        that.configData = Object.assign(that.configForm, res.data)
      }
    })
    that.showStationList = false
    //设备水波纹扩散
    let data1 = {
      current: 1,
      size: -1,
      alarmLevel: '',
      objectType: [],
      // regionId: [],
      regionId: null,
    }
    getRealtimeAlarmList(data1).then((res2) => {
      that.alarmList = res2.data.records
    })
  },
  mounted() {
    var that = this
    getMenuByType(1).then((res1) => {
      let id = res1.data.find((it) => it.url == this.$route.path).id
      this.sysResourceId = id
      that.getTemplateData()
    })
    const mapElement = that.$refs.map
    that.mapWidth = mapElement.clientWidth
    that.mapHeight = mapElement.clientHeight
    const containerElement = that.$refs.container
    var canvas = document.getElementById('imgDom')
    if (canvas) {
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
    }
    var canvas1 = document.getElementById('tempCanvas')
    if (canvas1) {
      var ctx1 = canvas1.getContext('2d')
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
      ctx1.beginPath()
    }
    var canvas2 = document.getElementById('myCanvas')
    if (canvas2) {
      var ctx2 = canvas2.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
      ctx2.beginPath()
    }
    // this.canvasContainerWidth = 0
    // this.canvasContainerHeight = 0
    this.showClip = false
    that.containerWidth = containerElement.clientWidth
    that.containerHeight = containerElement.clientHeight

    var modelId = sessionStorage.getItem('lastModelID')
    if (modelId) {
      that.show3D = true
      sessionStorage.removeItem('positionInfo')
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      sessionStorage.removeItem('lastModelID')
      that.initCesium(modelId)
    } else {
      that.show3D = false
      var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
      if (mapHistory) {
        that.operateList = mapHistory
        if (mapHistory[mapHistory.length - 1].objectLinkId) {
          that.imgUrl = mapHistory[mapHistory.length - 1].thumbnailUrl
          that.initMap(
            mapHistory[mapHistory.length - 1].objectLinkId,
            mapHistory[mapHistory.length - 1]
          )
        } else if (mapHistory[mapHistory.length - 1].picUrl) {
          that.imgUrl = mapHistory[mapHistory.length - 1].picUrl
          that.initMap(
            mapHistory[mapHistory.length - 1].id,
            mapHistory[mapHistory.length - 1]
          )
        }
      } else {
        that.operateList = []
        that.fetchTopMap()
      }
    }
    that.intervalId = setInterval(() => {
      if (that.gMap) {
        that.currentScale = that.gMap.getScale()
        that.currentCenter = that.gMap.getCenter()
        that.currentZoom = that.gMap.zoom
      }
    }, 10)
  },
  beforeDestroy() {
    // 组件销毁时清理所有动画
    Object.keys(this.cameraAlarmEffects).forEach((cid) => {
      this.clearCameraAlarm(cid)
    })
    if (this.viewer) {
      // 清空所有 primitives (包括模型)
      this.viewer.scene.primitives.removeAll()
      // 销毁 Cesium Viewer
      this.viewer.destroy()
      this.viewer = null
    }
    this.gMap && this.gMap.destroy()
    this.animationFrameId && cancelAnimationFrame(this.animationFrameId)
    this.rippleAnimationId && cancelAnimationFrame(this.rippleAnimationId)
    this.animationFrameId = null
    this.rippleAnimationId = null
    var canvas = document.getElementById('imgDom')
    if (canvas) {
      var ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
    }
    var canvas1 = document.getElementById('tempCanvas')
    if (canvas1) {
      var ctx1 = canvas1.getContext('2d')
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
      ctx1.beginPath()
    }
    var canvas2 = document.getElementById('myCanvas')
    if (canvas2) {
      var ctx2 = canvas2.getContext('2d')
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
      ctx2.beginPath()
    }
    // this.canvasContainerWidth = 0
    // this.canvasContainerHeight = 0
    this.showClip = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.debounceTimeout1) {
      clearTimeout(this.debounceTimeout1)
      this.debounceTimeout1 = null
    }
    if (this.debounceTimeout2) {
      clearTimeout(this.debounceTimeout2)
      this.debounceTimeout2 = null
    }
    if (this.debounceTimeout3) {
      clearTimeout(this.debounceTimeout3)
      this.debounceTimeout3 = null
    }
    // if (this.debounceTimeout4) {
    //   clearTimeout(this.debounceTimeout4)
    //   this.debounceTimeout4 = null
    // }
    if (this.showVR) {
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

      // 释放控件
      if (controls) {
        controls.dispose()
        controls = null
      }

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
      window.removeEventListener('resize', this.onResize)
      const container = document.getElementById('vr01')
      if (container) {
        container.removeEventListener('dblclick', this.dblClickEvent)
        // container.removeEventListener('click', this.onClick)
      }
    }
  },
  methods: {
    toggleImage() {
      this.showToggleFloor = !this.showToggleFloor
    },
    resetMyMap(data) {
      var that = this
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (this.debounceTimeout1) {
        clearTimeout(this.debounceTimeout1)
        this.debounceTimeout1 = null
      }
      if (this.debounceTimeout2) {
        clearTimeout(this.debounceTimeout2)
        this.debounceTimeout2 = null
      }
      if (this.debounceTimeout3) {
        clearTimeout(this.debounceTimeout3)
        this.debounceTimeout3 = null
      }
      window.removeEventListener('resize', that.onResize)
      const container = document.getElementById('vr01')
      if (container) {
        container.removeEventListener('dblclick', that.dblClickEvent)
      }
      var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
      mapHistory.push(data[0])
      sessionStorage.setItem('mapHistory', JSON.stringify(mapHistory))
      sessionStorage.setItem('hightlightInfo', JSON.stringify(data[0]))
      that.showVR = false
      that.gMap?.markerLayer.removeAllMarkers()
      that.textLayer && that.textLayer.removeAllTexts()
      that.featureLayer && that.featureLayer.removeAllFeatures()
      that.gMap?.removeLayerById('first-layer-image')
      that.gMap?.destroy()

      if (that.viewer) {
        that.viewer.scene.primitives.removeAll()
        that.viewer.destroy()
        that.viewer = null
      }

      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement = null
        renderer = null
      }

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      scene.clear()

      cameraGroup?.clear()
      linkGroup?.clear()
      markerGroup?.clear()
      textGroup?.clear()

      that.dataList.marker = []
      that.dataList.link = []
      that.dataList.label = []

      if (that.sphereTexture) {
        that.sphereTexture.dispose()
        that.sphereTexture = null
      }

      if (controls) {
        controls.dispose()
        controls = null
      }

      if (that.sphere) {
        scene.remove(that.sphere)
        that.sphere.geometry?.dispose()
        that.sphere.material?.dispose()
        that.sphere = null
      }

      if (that.renderId) {
        cancelAnimationFrame(that.renderId)
        that.renderId = null
      }
      that.initMap(data[0].id, data[0])
    },
    setCameraCenter(cameraId) {
      var that = this
      console.log(
        '执行监控点居中高亮---------------------------------------------------',
        cameraId
      )
      if (that.showVR) {
        // 1. VR图里找目标点坐标
        const cameraData = that.dataList.label.find(
          (item) => item.id === cameraId
        )
        const pos = new THREE.Vector3(cameraData.x, cameraData.y, cameraData.z)

        // 2. 单位方向向量
        const dir = pos.clone().normalize()

        // 3. 镜像对称点（相机新位置方向）
        const mirroredDir = dir.clone().negate()

        // 4. 原始相机距离
        const radius = camera.position.length()

        // 5. 新相机位置
        const newCamPos = mirroredDir.multiplyScalar(radius)

        // 6. 动画
        gsap.to(camera.position, {
          x: newCamPos.x,
          y: newCamPos.y,
          z: newCamPos.z,
          duration: 1.2,
          onUpdate: () => {
            camera.lookAt(0, 0, 0)
            controls.target.set(0, 0, 0)
            controls.update()
          },
          onComplete: () => {
            that.highlightCameraSprite(cameraId)
          },
        })
      } else {
        // 2. 平面图里找目标点坐标
        that.targetFeature && that.featureLayer.removeFeatureById('target-rect')
        const cameraData = that.savedJsonList.filter(
          (item) => item.objectLinkId === cameraId
        )
        cameraData.length > 0 &&
          setTimeout(() => {
            that.targetFeature = null
            that.targetFeature = addTargetRect(
              that.gMap,
              that.featureLayer,
              that.textLayer,
              {
                props: {
                  id: cameraId,
                  showName: false,
                  name: cameraData[0].name,
                },
                markerInfo: {
                  position: {
                    x: JSON.parse(cameraData[0].parameters)[0].x,
                    y: JSON.parse(cameraData[0].parameters)[0].y,
                  },
                },
              }
            )
          }, 100)
      }
    },
    highlightCameraSprite(cameraId) {
      // 1. 清除已有边框
      cameraGroup.children.forEach((child) => {
        if (child.userData.isHighlightBorder) {
          cameraGroup.remove(child)
        }
      })

      // 2. 找到目标sprite
      const targetSprite = cameraGroup.children.find(
        (child) => child.userData.id === cameraId
      )
      if (!targetSprite) return

      // 3. 生成带红色边框的canvas纹理
      const size = 128 // 纹理分辨率
      const borderWidth = 8 // 边框宽度
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = size
      const ctx = canvas.getContext('2d')
      // 透明背景
      ctx.clearRect(0, 0, size, size)
      // 红色边框
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = borderWidth
      ctx.strokeRect(
        borderWidth / 2,
        borderWidth / 2,
        size - borderWidth,
        size - borderWidth
      )
      // 中间透明
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillRect(
        borderWidth,
        borderWidth,
        size - borderWidth * 2,
        size - borderWidth * 2
      )

      // 4. 用canvas做SpriteMaterial
      const borderTexture = new THREE.CanvasTexture(canvas)
      const borderMaterial = new THREE.SpriteMaterial({
        map: borderTexture,
        transparent: true,
        depthTest: false,
      })
      const borderSprite = new THREE.Sprite(borderMaterial)
      borderSprite.scale.copy(targetSprite.scale).multiplyScalar(1.3) // 比目标sprite略大
      borderSprite.position.copy(targetSprite.position)
      borderSprite.userData.isHighlightBorder = true

      // 5. 保证边框在sprite后面
      cameraGroup.add(borderSprite)
      // sessionStorage.removeItem('hightlightInfo')
    },
    cancelHighlight() {
      var that = this
      cameraGroup.children.forEach((child) => {
        if (child.userData.isHighlightBorder) {
          cameraGroup.remove(child)
        }
      })
      that.targetFeature && that.featureLayer.removeFeatureById('target-rect')
      that.targetFeature = null
    },
    // 设置摄像头报警动画
    setCameraAlarm(cameraId) {
      const cameraSprite = cameraGroup.children.find(
        (child) => child.userData?.id === cameraId
      )
      if (!cameraSprite) return
      if (this.cameraAlarmEffects[cameraId]) return

      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })

      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(cameraSprite.position)
      sprite.renderOrder = 999
      cameraGroup.add(sprite)

      // 动画参数
      let rippleRadius = 0
      const minRadius = 0
      const maxRadius = 14
      const speed = 0.3
      let running = true

      const drawFilledCircle = (radius) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)'
        ctx.fill()
      }

      const animate = () => {
        if (!running) return

        drawFilledCircle(rippleRadius)
        texture.needsUpdate = true

        // 让 Sprite 缩放跟随视觉放大
        const scale = rippleRadius / 8 + 0.1
        sprite.scale.set(scale, scale, 1)

        rippleRadius += speed
        if (rippleRadius > maxRadius) rippleRadius = minRadius

        sprite._alarmAnimId = requestAnimationFrame(animate)
      }

      animate()

      this.cameraAlarmEffects[cameraId] = {
        sprite,
        stop: () => {
          running = false
          if (sprite._alarmAnimId) cancelAnimationFrame(sprite._alarmAnimId)
        },
      }
    },
    // 清除摄像头报警动画
    clearCameraAlarm(cameraId) {
      const alarm = this.cameraAlarmEffects[cameraId]
      if (!alarm) return

      const { sprite, stop } = alarm

      // 停止动画
      stop?.()

      // 从场景中移除 sprite
      cameraGroup.remove(sprite)

      // 释放资源
      sprite.material?.dispose()
      sprite.geometry?.dispose?.()

      // 删除缓存
      delete this.cameraAlarmEffects[cameraId]
    },
    async initCesium(objectLinkId) {
      var that = this
      let dataArg = {
        current: 1,
        size: -1,
        type: 10,
        name: '',
        regionId: '',
        flag: true,
      }
      try {
        const res = await getMapByPage(dataArg) // 使用 await 等待数据
        if (res.code == 200) {
          var modelList = res.data.records
          console.log(modelList, '所有模型')
          const modelItem = modelList.find((item) => item.id === objectLinkId)
          if (modelItem) {
            let modelUrl = modelItem.fileServerUrl // glb模型的url地址
            this.show3D = true
            this.showStationList = false
            this.showToggleFloor = false
            this.gMap && this.gMap.destroy()
            this.animationFrameId && cancelAnimationFrame(this.animationFrameId)
            this.rippleAnimationId &&
              cancelAnimationFrame(this.rippleAnimationId)
            this.animationFrameId = null
            this.rippleAnimationId = null
            var canvas = document.getElementById('imgDom')
            if (canvas) {
              var ctx = canvas.getContext('2d')
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.beginPath()
            }
            var canvas1 = document.getElementById('tempCanvas')
            if (canvas1) {
              var ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
              ctx1.beginPath()
            }
            var canvas2 = document.getElementById('myCanvas')
            if (canvas2) {
              var ctx2 = canvas2.getContext('2d')
              ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
              ctx2.beginPath()
            }
            this.showClip = false
            if (this.intervalId) {
              clearInterval(this.intervalId)
              this.intervalId = null // 清除后将 intervalId 置为 null
            }
            if (this.debounceTimeout1) {
              clearTimeout(this.debounceTimeout1)
              this.debounceTimeout1 = null
            }
            if (this.debounceTimeout2) {
              clearTimeout(this.debounceTimeout2)
              this.debounceTimeout2 = null
            }
            if (this.debounceTimeout3) {
              clearTimeout(this.debounceTimeout3)
              this.debounceTimeout3 = null
            }
            // cesium token (仅供个人测试使用)
            let tokenList = [
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MWFiNGE5NC1mZjc5LTRiYjYtOGVhMy04Nzc5ZmExMDQ0NzEiLCJpZCI6MjUxMTgxLCJpYXQiOjE3MzA4NjIyMzF9.23k6K7DvJgAuC32JLPNpSECOEMIsjF54Vnkv2_4k25Q',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNzcxYjkwMC1hNTcwLTQ5MDMtYmFiYi02NWEzYjIyYjhkMDMiLCJpZCI6MjUxMTgxLCJpYXQiOjE3MzEwNTI2MTZ9.FZLNUD4q2cyCuhJyGFnPp6nS-twR11bTaqC22N9YX44',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YTk2NzNkZS05MGYyLTQ2YTYtOGNkNS1kM2M1ODBkMzE4MWEiLCJpZCI6MjUxMTgxLCJpYXQiOjE3MzEwNTI2NTZ9.e1-5sep-msTtIN3XOSoHLvoLVvyeOu4W181F0MB_3To',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjlkMzVjNC0zOGM3LTRmNTAtYTJmMi1jMzY0M2VhMjZjNWYiLCJpZCI6MjUxMTgxLCJpYXQiOjE3MzEwNTUwNTV9.iinP7rhvhCoibgkiLgH1rer_XGtYjhibw1Y2EOMJe-k',
            ]
            let uuid = Math.floor(Math.random() * tokenList.length)
            Cesium.Ion.defaultAccessToken = tokenList[uuid]

            this.viewer = new Cesium.Viewer('cesium01', {
              homeButton: false,
              sceneModePicker: false,
              baseLayerPicker: false,
              animation: false,
              timeline: false,
              infoBox: false,
              selectionIndicator: false,
              geocoder: false,
              fullscreenButton: false,
              shouldAnimate: false,
              navigationHelpButton: false,
            })

            // 隐藏版权信息
            this.viewer._cesiumWidget._creditContainer.style.display = 'none'

            // 加载 glb 模型
            const position = Cesium.Cartesian3.fromDegrees(113.9183, 22.5134, 0) // 经纬度和高度
            const heading = Cesium.Math.toRadians(0) // 模型的朝向
            const pitch = 0
            const roll = 0
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
            const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
              position,
              hpr
            )

            const model = await Cesium.Model.fromGltfAsync({
              url: modelUrl, // 模型的 URL
              modelMatrix: modelMatrix,
              scale: 1.0, // 放大倍数
            })
            this.viewer.scene.primitives.add(model)

            // 自动调整视角到模型位置
            this.viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(113.9183, 22.513, 50),
              orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-30),
                roll: 0,
              },
            })
            sessionStorage.setItem('lastModelID', objectLinkId)
          } else {
            this.$message.info('请配置关联的模型数据')
          }
        }
      } catch (error) {
        console.error('初始化失败', error)
      }
    },
    toggleFontSize(item, index) {
      var that = this
      if (that.activeIndex === index) {
        that.isLarge = !that.isLarge // 切换字体大小状态
      } else {
        that.isLarge = true // 激活新的项时，字体大小设置为大
      }
      that.activeIndex = index // 更新激活项索引
      console.log('当前的item', item)
      let queryData = qs.stringify({
        objectId: item.alarmObjId,
        regionId: '',
      })
      getMapByDeviceId(queryData).then((res111) => {
        if (res111.data.length > 0) {
          var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
          if (res111.data[0].id == sessionStorage.getItem('lastMapID')) {
            // 是当前图，只定位
            sessionStorage.setItem(
              'positionInfo',
              JSON.stringify(JSON.parse(res111.data[0].labels[0].parameters)[0])
            )
            // that.$router.push({
            //   path: "/comprehensive-control/mapIndex"
            // })
            that.imgUrl = res111.data[0].picUrl
            that.initMap(
              res111.data[0].id,
              res111.data[0],
              res111.data[0].id,
              JSON.parse(res111.data[0].labels[0].parameters)[0]
            )
          } else {
            mapHistory.push(res111.data[0])
            sessionStorage.setItem('mapHistory', JSON.stringify(mapHistory))
            // that.$router.push({
            //   path: "/comprehensive-control/mapIndex"
            // })
            that.imgUrl = res111.data[0].picUrl
            that.initMap(
              res111.data[0].id,
              res111.data[0],
              res111.data[0].id,
              JSON.parse(res111.data[0].labels[0].parameters)[0]
            )
          }
        } else {
          that.$message.info('暂未配置此设备')
          return
        }
      })
    },
    getMaxDistance(positionObj) {
      let maxY = -Infinity
      let minY = Infinity

      // 找到最大和最小的 Y 坐标值
      positionObj.forEach((point) => {
        maxY = Math.max(maxY, point.y)
        minY = Math.min(minY, point.y)
      })

      // 计算极差
      const deltaY = (maxY - minY) * 0.5
      return deltaY
    },
    getCenterPosition(positionObj) {
      // 计算中心点的坐标
      let totalX = 0
      let totalY = 0
      const numPoints = positionObj.length
      for (const point of positionObj) {
        totalX += point.x
        totalY += point.y
      }
      const centerX = totalX / numPoints
      const centerY = totalY / numPoints
      // 返回中心点坐标对象
      return { x: centerX, y: centerY }
    },
    expandAlarm() {
      this.isExpanded = !this.isExpanded
    },
    findAncestorWithLevel3(itemId) {
      const findAncestor = (item, ancestors) => {
        if (item.id === itemId) {
          return ancestors
        }

        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            const result = findAncestor(child, ancestors.concat(item))
            if (result) {
              return result
            }
          }
        }

        return null
      }

      for (const item of this.regionData) {
        const ancestors = findAncestor(item, [])
        if (ancestors) {
          for (const ancestor of ancestors) {
            if (ancestor.level === 3) {
              return ancestor
            }
          }
        }
      }

      return null
    },
    addLevelToTree(treeData, parentLevel = 1) {
      treeData.forEach((node) => {
        node.level = parentLevel // 设置当前节点的层级

        if (node.children && node.children.length > 0) {
          // 递归处理子节点
          this.addLevelToTree(node.children, parentLevel + 1)
        }
      })
    },
    findItemById(data, id) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i] // 找到了匹配的 ID，返回该项的 children
        }

        if (data[i].children && data[i].children.length > 0) {
          const children = this.findItemById(data[i].children, id) // 递归查找子项
          if (children) return children // 如果在子项中找到了匹配的 ID，返回其 children
        }
      }
      return null // 在整个树中未找到匹配的 ID
    },
    handleStationClick(item, index) {
      var that = this
      if (item.type == '1') {
        this.$message.info('请先配置平面图')
        return
      } else {
        console.log(item, '圆点数据')
        console.log(that.operateList)
        if (that.stationIndex == index) return
        // that.operateList.push(item)
        sessionStorage.removeItem('positionInfo')
        that.stationIndex = index
        let data = {
          regionId: item.id,
          current: 1,
          size: -1,
          name: '',
          flag: false,
          type: '',
        }
        getMapByPage(data).then((res) => {
          let tempList = res.data.records.filter((it) => it.deleteFlag == '0')
          if (tempList.length == 0) {
            this.$message.error('暂未配置平面图')
            return
          }
          function customSort(a, b) {
            if (a.type === b.type) {
              return a.sort - b.sort
            } else {
              return a.type - b.type
            }
            // return a.sort - b.sort
          }
          let resultList = tempList.sort(customSort)
          console.log(resultList, '圆点下所有数据')
          var toggleAllFloorList = resultList
          sessionStorage.setItem(
            'toggleAllFloorList',
            JSON.stringify(toggleAllFloorList)
          )
          that.showToggleFloor = true
          that.showToggleName = toggleAllFloorList.find(
            (item) => item.id === resultList[0].id
          ).name
          that.showToggleIndex = toggleAllFloorList.findIndex(
            (item) => item.id === resultList[0].id
          )
          that.operateList.push(resultList[0])
          sessionStorage.setItem('mapHistory', JSON.stringify(that.operateList))
          that.toggleAllFloorList = toggleAllFloorList //修复bug
          this.gMap && this.gMap.markerLayer.removeAllMarkers()
          this.textLayer && this.textLayer.removeAllTexts()
          this.featureLayer && this.featureLayer.removeAllFeatures()
          this.gMap && this.gMap.removeLayerById('first-layer-image')
          // this.imgUrl = 'http://192.168.1.175:8090' + resultList[0].picUrl
          this.imgUrl = resultList[0].picUrl
          that.initMap(resultList[0].id)
          // that.$router.push({
          //   path: "/comprehensive-control/mapIndex",
          //   query: {
          //     id: resultList[0].id,
          //     isJump: that.$route.query.isJump
          //   },
          // })
        })
      }
      // if (that.stationIndex == index) { return }
      // if (item.type != 4) {
      //   let data = qs.stringify({
      //     regionId: item.id,
      //     current: 1,
      //     size: -1,
      //     keyword: "",
      //   })
      //   getMapByPage(data).then((res) => {
      //     let tempList = res.data.records.filter(it => it.deleteFlag == "0")
      //     if (tempList.length == 0) {
      //       this.$message.error('暂未配置平面图！')
      //       return
      //     }
      //     function customSort (a, b) {
      //       if (a.type === b.type) {
      //         return a.sort - b.sort
      //       } else {
      //         return a.type - b.type
      //       }
      //     }
      //     let resultList = tempList.sort(customSort)
      //     console.log(resultList)
      //     var toggleAllFloorList = resultList
      //     sessionStorage.setItem("toggleAllFloorList", JSON.stringify(toggleAllFloorList))
      //     // alert(1)
      //     that.toggleAllFloorList = toggleAllFloorList //修复bug
      //     that.$router.push({
      //       path: "/comprehensive-control/mapIndex",
      //       query: {
      //         id: resultList[0].id,
      //         isJump: that.$route.query.isJump
      //       },
      //     })
      //   })
      // } else if (item.type == 4) {
      //   that.$router.push({
      //     path: "/comprehensive-control/mapIndex",
      //     query: {
      //       id: item.id,
      //       isJump: that.$route.query.isJump
      //     },
      //   })
      // }
    },
    goToLeft: debounce(function () {
      var that = this
      if (this.showToggleIndex == 0) {
        return
      } else {
        // this.$router.push({
        //   path: "/comprehensive-control/mapIndex",
        //   query: {
        //     id: this.toggleAllFloorList[this.showToggleIndex - 1].id,
        //     isJump: this.$route.query.isJump
        //   },
        // })
        sessionStorage.removeItem('positionInfo')
        that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
        that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
        that.animationFrameId = null
        that.rippleAnimationId = null
        console.log(this.showToggleIndex)
        this.showToggleIndex -= 1
        this.operateList.push(this.toggleAllFloorList[this.showToggleIndex])
        sessionStorage.setItem('mapHistory', JSON.stringify(this.operateList))
        this.showToggleName = this.toggleAllFloorList[this.showToggleIndex].name
        this.gMap && this.gMap.markerLayer.removeAllMarkers()
        this.textLayer && this.textLayer.removeAllTexts()
        this.featureLayer && this.featureLayer.removeAllFeatures()
        this.gMap && this.gMap.removeLayerById('first-layer-image')
        // this.imgUrl = 'http://192.168.1.175:8090' + this.toggleAllFloorList[this.showToggleIndex].picUrl
        this.imgUrl = this.toggleAllFloorList[this.showToggleIndex].picUrl
        console.log(
          '*******点击左键头切换********',
          this.toggleAllFloorList[this.showToggleIndex].id,
          this.toggleAllFloorList[this.showToggleIndex]
        )
        if (that.showVR) {
          if (that.viewer) {
            // 清空所有 primitives (包括模型)
            that.viewer.scene.primitives.removeAll()
            // 销毁 Cesium Viewer
            that.viewer.destroy()
            that.viewer = null
          }
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
          scene.clear()

          // 清空 Group 对象内容
          if (cameraGroup) cameraGroup.clear()
          if (linkGroup) linkGroup.clear()
          if (markerGroup) markerGroup.clear()
          if (textGroup) textGroup.clear()

          // 清空 dataList 数据
          that.dataList.marker = []
          that.dataList.link = []
          that.dataList.label = []

          // 释放纹理
          if (that.sphereTexture) {
            that.sphereTexture.dispose()
            that.sphereTexture = null
          }

          // 释放控件
          if (controls) {
            controls.dispose()
            controls = null
          }

          // 清空 sphere
          if (that.sphere) {
            scene.remove(that.sphere) // 从场景中移除
            if (that.sphere.geometry) that.sphere.geometry.dispose() // 释放几何体
            if (that.sphere.material) that.sphere.material.dispose() // 释放材质
            that.sphere = null
          }

          // 停止渲染循环
          if (that.renderId) {
            cancelAnimationFrame(that.renderId)
            that.renderId = null
          }
          window.removeEventListener('resize', that.onResize)
          const container = document.getElementById('vr01')
          if (container) {
            container.removeEventListener('dblclick', that.dblClickEvent)
            // container.removeEventListener('click', that.onClick)
          }
          that.showVR = false
        }
        this.initMap(
          this.toggleAllFloorList[this.showToggleIndex].id,
          this.toggleAllFloorList[this.showToggleIndex],
          this.toggleAllFloorList[this.showToggleIndex].id
        )
      }
    }, 1000),
    goToRight: debounce(function () {
      var that = this
      if (this.showToggleIndex == this.toggleAllFloorList.length - 1) {
        return
      } else {
        sessionStorage.removeItem('positionInfo')
        that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
        that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
        that.animationFrameId = null
        that.rippleAnimationId = null
        this.showToggleIndex += 1
        this.operateList.push(this.toggleAllFloorList[this.showToggleIndex])
        sessionStorage.setItem('mapHistory', JSON.stringify(this.operateList))
        this.showToggleName = this.toggleAllFloorList[this.showToggleIndex].name
        this.gMap && this.gMap.markerLayer.removeAllMarkers()
        this.textLayer && this.textLayer.removeAllTexts()
        this.featureLayer && this.featureLayer.removeAllFeatures()
        this.gMap && this.gMap.removeLayerById('first-layer-image')
        // this.imgUrl = 'http://192.168.1.175:8090' + this.toggleAllFloorList[this.showToggleIndex].picUrl
        this.imgUrl = this.toggleAllFloorList[this.showToggleIndex].picUrl
        console.log(
          '*******点击左右键头切换********',
          this.toggleAllFloorList[this.showToggleIndex].id,
          this.toggleAllFloorList[this.showToggleIndex]
        )
        if (that.showVR) {
          if (that.viewer) {
            // 清空所有 primitives (包括模型)
            that.viewer.scene.primitives.removeAll()
            // 销毁 Cesium Viewer
            that.viewer.destroy()
            that.viewer = null
          }
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
          scene.clear()

          // 清空 Group 对象内容
          if (cameraGroup) cameraGroup.clear()
          if (linkGroup) linkGroup.clear()
          if (markerGroup) markerGroup.clear()
          if (textGroup) textGroup.clear()

          // 清空 dataList 数据
          that.dataList.marker = []
          that.dataList.link = []
          that.dataList.label = []

          // 释放纹理
          if (that.sphereTexture) {
            that.sphereTexture.dispose()
            that.sphereTexture = null
          }

          // 释放控件
          if (controls) {
            controls.dispose()
            controls = null
          }

          // 清空 sphere
          if (that.sphere) {
            scene.remove(that.sphere) // 从场景中移除
            if (that.sphere.geometry) that.sphere.geometry.dispose() // 释放几何体
            if (that.sphere.material) that.sphere.material.dispose() // 释放材质
            that.sphere = null
          }

          // 停止渲染循环
          if (that.renderId) {
            cancelAnimationFrame(that.renderId)
            that.renderId = null
          }
          window.removeEventListener('resize', that.onResize)
          const container = document.getElementById('vr01')
          if (container) {
            container.removeEventListener('dblclick', that.dblClickEvent)
            // container.removeEventListener('click', that.onClick)
          }
          that.showVR = false
        }
        this.initMap(
          this.toggleAllFloorList[this.showToggleIndex].id,
          this.toggleAllFloorList[this.showToggleIndex],
          this.toggleAllFloorList[this.showToggleIndex].id
        )
        // this.$router.push({
        //   path: "/comprehensive-control/mapIndex",
        //   query: {
        //     id: this.toggleAllFloorList[this.showToggleIndex + 1].id,
        //     isJump: this.$route.query.isJump
        //   },
        // })
      }
    }, 1000),
    goToDot(item, index) {
      var that = this
      console.log(item, index)
      if (index == that.showToggleIndex) return
      sessionStorage.removeItem('positionInfo')
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      that.showToggleIndex = index
      that.operateList.push(item)
      sessionStorage.setItem('mapHistory', JSON.stringify(that.operateList))
      that.gMap && that.gMap.markerLayer.removeAllMarkers()
      that.textLayer && that.textLayer.removeAllTexts()
      that.featureLayer && that.featureLayer.removeAllFeatures()
      that.gMap && that.gMap.removeLayerById('first-layer-image')
      // that.imgUrl = 'http://192.168.1.175:8090' + item.picUrl
      this.imgUrl = item.picUrl
      that.showToggleName = that.toggleAllFloorList[index].name
      if (that.showVR) {
        if (that.viewer) {
          // 清空所有 primitives (包括模型)
          that.viewer.scene.primitives.removeAll()
          // 销毁 Cesium Viewer
          that.viewer.destroy()
          that.viewer = null
        }
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
        scene.clear()

        // 清空 Group 对象内容
        if (cameraGroup) cameraGroup.clear()
        if (linkGroup) linkGroup.clear()
        if (markerGroup) markerGroup.clear()
        if (textGroup) textGroup.clear()

        // 清空 dataList 数据
        that.dataList.marker = []
        that.dataList.link = []
        that.dataList.label = []

        // 释放纹理
        if (that.sphereTexture) {
          that.sphereTexture.dispose()
          that.sphereTexture = null
        }

        // 释放控件
        if (controls) {
          controls.dispose()
          controls = null
        }

        // 清空 sphere
        if (that.sphere) {
          scene.remove(that.sphere) // 从场景中移除
          if (that.sphere.geometry) that.sphere.geometry.dispose() // 释放几何体
          if (that.sphere.material) that.sphere.material.dispose() // 释放材质
          that.sphere = null
        }

        // 停止渲染循环
        if (that.renderId) {
          cancelAnimationFrame(that.renderId)
          that.renderId = null
        }
        window.removeEventListener('resize', that.onResize)
        const container = document.getElementById('vr01')
        if (container) {
          container.removeEventListener('dblclick', that.dblClickEvent)
          // container.removeEventListener('click', that.onClick)
        }
        that.showVR = false
      }
      console.log('*******点击同级点切换********', item.id, item)
      that.initMap(item.id, item, item.id)
      // this.$router.push({
      //   path: "/comprehensive-control/mapIndex",
      //   query: {
      //     id: this.toggleAllFloorList[index].id,
      //     isJump: this.$route.query.isJump
      //   },
      // })
    },
    goToMarker(item) {
      var that = this
      sessionStorage.removeItem('positionInfo')
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      // that.showToggleIndex = index
      // that.operateList.push(item)
      // sessionStorage.setItem('mapHistory', JSON.stringify(that.operateList))
      that.gMap && that.gMap.markerLayer.removeAllMarkers()
      that.textLayer && that.textLayer.removeAllTexts()
      that.featureLayer && that.featureLayer.removeAllFeatures()
      that.gMap && that.gMap.removeLayerById('first-layer-image')
      this.imgUrl = ''
      that.showToggleName = ''
      if (that.showVR) {
        if (that.viewer) {
          // 清空所有 primitives (包括模型)
          that.viewer.scene.primitives.removeAll()
          // 销毁 Cesium Viewer
          that.viewer.destroy()
          that.viewer = null
        }
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
        scene.clear()

        // 清空 Group 对象内容
        if (cameraGroup) cameraGroup.clear()
        if (linkGroup) linkGroup.clear()
        if (markerGroup) markerGroup.clear()
        if (textGroup) textGroup.clear()

        // 清空 dataList 数据
        that.dataList.marker = []
        that.dataList.link = []
        that.dataList.label = []

        // 释放纹理
        if (that.sphereTexture) {
          that.sphereTexture.dispose()
          that.sphereTexture = null
        }

        // 释放控件
        if (controls) {
          controls.dispose()
          controls = null
        }

        // 清空 sphere
        if (that.sphere) {
          scene.remove(that.sphere) // 从场景中移除
          if (that.sphere.geometry) that.sphere.geometry.dispose() // 释放几何体
          if (that.sphere.material) that.sphere.material.dispose() // 释放材质
          that.sphere = null
        }

        // 停止渲染循环
        if (that.renderId) {
          cancelAnimationFrame(that.renderId)
          that.renderId = null
        }
        window.removeEventListener('resize', that.onResize)
        const container = document.getElementById('vr01')
        if (container) {
          container.removeEventListener('dblclick', that.dblClickEvent)
          // container.removeEventListener('click', that.onClick)
        }
        that.showVR = false
      }
      that.initMap(item.objectLinkId)
    },
    getTemplateData() {
      // this.templateId = ''
      getTemplateList('0').then((res) => {
        if (res.code == 200) {
          let list = res.data.filter(
            (v) => v.useFlag && v.sysResourceId == this.sysResourceId
          )
          if (list.length == 0) {
            this.hidenLeftPanel = true
            this.hidenRightPanel = true
          } else {
            this.getDetail(list[0].id)
          }
        }
      })
    },
    // 获取useFlag为true的具体信息
    getDetail(item) {
      let id = item
      if (!id || id == '') {
        return
      }
      getTemplateById(id).then((res) => {
        if (res.code == 200) {
          let obj = res.data
          this.showList = []
          let list = obj.mapTabs
          console.log(list)
          list[0].mapPanels = list[0].mapPanels.sort(function (a, b) {
            return a.sort - b.sort
          })
          const isFirstNumNull = list[0].mapPanels
            .slice(0, list[0].type)
            .every((item) => item.component == null)
          const isLastNumNull = list[0].mapPanels
            .slice(list[0].type, list[0].mapPanels.length)
            .every((item) => item.component == null)
          this.hidenRightPanel = isFirstNumNull
          this.hidenLeftPanel = isLastNumNull
          list?.forEach((v) => {
            let data = v.mapPanels
            data?.forEach((el) => {
              this.showList.push(el)
            })
            this.showList.sort(function (a, b) {
              return a.sort - b.sort
            })
          })
          console.log('this.showList', this.showList)
        }
      })
    },
    // 切换至纯数据面板展示
    changeToShowData() {
      // this.isShow = false
      setTimeout(() => {
        this.layoutType = 'data'
        this.isChange = true
      }, 1000)
    },
    // 切换至地图加数据面板展示
    changeToMap() {
      // this.isShow = false
      this.isChange = false
      setTimeout(() => {
        this.layoutType = 'default'
      }, 1000)
    },
    canvasClick() {
      console.log('切图层点击')
    },
    canvasDbclick() {
      var c = document.getElementById('imgDom')
      console.log(c.width, c.height)
      console.log(c)
      var cxt = c.getContext('2d')
      cxt.clearRect(0, 0, c.width, c.height)
      var that = this
      console.log(this.targetFeatureId)
      let objectLinkId = that.savedJsonList.filter(
        (item) => item.parameters.id == that.targetFeatureId
      )[0].objectLinkId
      if (objectLinkId) {
        console.log(this.mapList)
        let toBuildingItem = this.mapList.filter(
          (item) => item.id === objectLinkId
        )
        let toBuildingType = toBuildingItem[0].type
        let toBuildingRegionId = toBuildingItem[0].regionId
        var toggleAllFloorList = []
        if (toBuildingType === 1) {
          //跳转到某一层，需并排显示其它层
          this.mapList.forEach((item) => {
            if (item.regionId === toBuildingRegionId && item.type === 1) {
              toggleAllFloorList.push(item)
            }
          })
          toggleAllFloorList.sort((a, b) => {
            if (a.floorNo === b.floorNo) {
              // 如果floorNo相同，则按照sort升序排列
              return a.sort - b.sort
            } else {
              // 否则按照floorNo升序排列
              return a.floorNo - b.floorNo
            }
          })
          sessionStorage.setItem(
            'toggleAllFloorList',
            JSON.stringify(toggleAllFloorList)
          )
          // alert(2)
          this.toggleAllFloorList = toggleAllFloorList //修复bug
          this.$router.push({
            path: '/comprehensive-control/mapIndex',
            query: {
              id: objectLinkId,
              isJump: this.$route.query.isJump,
            },
          })
        } else {
          //不需要切换
          sessionStorage.setItem('toggleAllFloorList', JSON.stringify([]))
          // this.toggleAllFloorList = [] //修复bug
          this.$router.push({
            path: '/comprehensive-control/mapIndex',
            query: {
              id: objectLinkId,
              isJump: this.$route.query.isJump,
            },
          })
        }
      } else {
        sessionStorage.setItem('toggleAllFloorList', JSON.stringify([]))
        // this.toggleAllFloorList = [] //修复bug
        return
      }
    },
    toggleClip(event) {
      this.targetFeature && this.featureLayer.removeFeatureById('target-rect')
      // console.log(event.target.id)
      // if (event.target.id == "" && !this.activeFour) {
      //   // alert(event.target.id)
      //   var actionOne = {
      //     type: 103,
      //     isRealVideo: 1,
      //     startPosition: "rightScreen",
      //     cameraIds: this.allCameraMarkers,
      //     data: []
      //   }
      //   this.$parent.$parent.$parent.$parent.toOpenCamera(JSON.stringify(actionOne))
      // }
      if (this.showClip == true) {
        var canvas = document.getElementById('imgDom')
        if (canvas) {
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.beginPath()
        }
        var canvas1 = document.getElementById('tempCanvas')
        if (canvas1) {
          var ctx1 = canvas1.getContext('2d')
          ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
          ctx1.beginPath()
        }
        var canvas2 = document.getElementById('myCanvas')
        if (canvas2) {
          var ctx2 = canvas2.getContext('2d')
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          ctx2.beginPath()
        }
        // this.canvasContainerWidth = 0
        // this.canvasContainerHeight = 0
        this.showClip = false
      }
    },
    debounce(func, delay) {
      let timeout
      return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(this)
        }, delay)
      }
    },
    goBack() {
      var that = this
      that.activeThree = true
      that.activeTwo = false
      this.activeOne = false
      this.activeFour = false
      if (that.showVR) {
        if (this.viewer) {
          // 清空所有 primitives (包括模型)
          this.viewer.scene.primitives.removeAll()
          // 销毁 Cesium Viewer
          this.viewer.destroy()
          this.viewer = null
        }
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
        scene.clear()

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

        // 释放控件
        if (controls) {
          controls.dispose()
          controls = null
        }

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
        window.removeEventListener('resize', this.onResize)
        const container = document.getElementById('vr01')
        if (container) {
          container.removeEventListener('dblclick', this.dblClickEvent)
          // container.removeEventListener('click', this.onClick)
        }
        setTimeout(() => {
          this.activeThree = false
          this.activeTwo = false
          this.activeOne = false
          this.activeFour = false
          this.activeFive = false
          getBackByMapId(that.currentMapId).then((res111) => {
            console.log(res111.data, '返回数据信息')
            if (res111.data && res111.data.length > 0) {
              getLineMap(res111.data[0]).then((res222) => {
                console.log('res222.data', res222.data)
                that.animationFrameId = null
                that.rippleAnimationId = null
                // 在这里放置点击事件的处理逻辑
                that.showToggleFloor = false
                that.showStationList = false
                that.stationList = []
                that.stationIndex = -1
                that.deviceList = []
                that.polyList = []
                that.gMap && that.gMap.markerLayer.removeAllMarkers()
                that.textLayer && that.textLayer.removeAllTexts()
                that.featureLayer && that.featureLayer.removeAllFeatures()
                that.gMap && that.gMap.removeLayerById('first-layer-image')
                that.operateList.pop()
                console.log(
                  that.operateList,
                  that.operateList.length,
                  '最新记录数组'
                )
                sessionStorage.setItem(
                  'mapHistory',
                  JSON.stringify(that.operateList)
                )
                that.imgUrl = res222.data.picUrl
                // that.imgUrl = 'http://192.168.1.175:8090' + res222.data.picUrl
                this.showVR = false
                that.initMap(res222.data.id, res222.data)
              })
            } else {
              that.$message.info('当前图无法返回上级')
            }
            that.activeThree = false
          })
        }, 500)
      } else {
        sessionStorage.removeItem('positionInfo')
        console.log('当前图id', that.currentMapId)
        clearTimeout(that.debounceTimeout1)
        that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
        that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
        that.animationFrameId = null
        that.rippleAnimationId = null
        that.debounceTimeout1 = setTimeout(() => {
          getBackByMapId(that.currentMapId).then((res111) => {
            console.log(res111.data, '返回数据信息')
            if (res111.data && res111.data.length > 0) {
              getLineMap(res111.data[0]).then((res222) => {
                that.animationFrameId = null
                that.rippleAnimationId = null
                // 在这里放置点击事件的处理逻辑
                that.showToggleFloor = false
                that.showStationList = false
                that.stationList = []
                that.stationIndex = -1
                that.deviceList = []
                that.polyList = []
                that.gMap && that.gMap.markerLayer.removeAllMarkers()
                that.textLayer && that.textLayer.removeAllTexts()
                that.featureLayer && that.featureLayer.removeAllFeatures()
                that.gMap && that.gMap.removeLayerById('first-layer-image')
                that.operateList.pop()
                console.log(
                  that.operateList,
                  that.operateList.length,
                  '最新记录数组'
                )
                sessionStorage.setItem(
                  'mapHistory',
                  JSON.stringify(that.operateList)
                )
                that.imgUrl = res222.data.picUrl
                // that.imgUrl = 'http://192.168.1.175:8090' + res222.data.picUrl
                that.initMap(res222.data.id, res222.data)
              })
            } else {
              that.$message.info('当前图无法返回上级')
            }
            if (that.command == 'RECT') {
              that.activeFour = true
            } else {
              that.activeFour = false
            }
            that.activeThree = false
          })
        }, 500)
      }
    },
    goSelect() {
      var that = this
      that.activeFour = true
      that.activeThree = false
      that.activeTwo = false
      this.activeOne = false
      this.command = 'RECT'
      this.gMap.setMode('RECT')
      setDrawingStyle(this.gMap, this.command)
    },
    backModel() {
      var that = this
      that.activeFour = false
      that.activeThree = false
      that.activeTwo = false
      that.activeOne = false
      that.activeFive = true
      sessionStorage.removeItem('positionInfo')
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      clearTimeout(that.debounceTimeout5)
      that.debounceTimeout5 = setTimeout(() => {
        that.activeFive = false
        sessionStorage.removeItem('lastModelID')
        let lastMapId = sessionStorage.getItem('lastMapID')
        that.show3D = false
        that.initMap(lastMapId)
      }, 500)
    },
    goResize() {
      var that = this
      this.activeOne = true
      this.activeTwo = false
      this.activeThree = false
      this.activeFour = false
      if (that.showVR) {
        // 重置相机位置
        camera.position.set(
          initialCameraPosition.x,
          initialCameraPosition.y,
          initialCameraPosition.z
        )
        camera.lookAt(0, 0, 0) // 确保相机朝向场景中心

        // 如果有控制器，重置控制器目标
        if (controls) {
          controls.target.set(0, 0, 0) // 设置控制器目标为场景中心
          controls.update() // 更新控制器
        }

        // 重新渲染场景
        renderer.render(scene, camera)
        setTimeout(() => {
          that.activeOne = false
        }, 500)
      } else {
        sessionStorage.removeItem('positionInfo')
        that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
        that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
        that.animationFrameId = null
        that.rippleAnimationId = null
        console.log('刷新前地图id', that.currentMapId)
        console.log('listinfo************', that.listInfo)
        clearTimeout(that.debounceTimeout2)
        that.debounceTimeout2 = setTimeout(() => {
          that.showToggleFloor = false
          that.showStationList = false
          that.stationList = []
          that.stationIndex = -1
          // that.markerList = []
          that.deviceList = []
          that.polyList = []
          that.gMap && that.gMap.markerLayer.removeAllMarkers()
          that.textLayer && that.textLayer.removeAllTexts()
          that.featureLayer && that.featureLayer.removeAllFeatures()
          that.gMap && that.gMap.removeLayerById('first-layer-image')
          // console.log('刷新后地图id', that.operateList[that.operateList.length - 1].id)
          // that.imgUrl = that.listInfo.thumbnailUrl
          // that.initMap(that.currentMapId, that.listInfo.length > 0 ? that.listInfo[0] : that.listInfo)
          // 假设 listInfo 是一个数组
          if (that.listInfo && that.listInfo.length > 0) {
            that.imgUrl = that.listInfo[0].thumbnailUrl
            // that.imgUrl = 'http://192.168.1.175:8090' + that.listInfo[0].thumbnailUrl
            that.initMap(that.currentMapId, that.listInfo[0])
          } else {
            that.imgUrl = that.listInfo.thumbnailUrl
            // that.imgUrl = 'http://192.168.1.175:8090' + that.listInfo.thumbnailUrl
            that.initMap(that.currentMapId, that.listInfo)
          }
          that.activeOne = false
        }, 500)
      }
    },
    goToggleDevice() {
      // setTimeout(() => {
      //   console.log(that.gMap.markerLayer.getAllMarkers(), '所有Marker')
      //   console.log(that.textLayer.getAllTexts(), '所有Text')
      // }, 0)
      var that = this
      that.activeTwo = true
      this.activeOne = false
      this.activeThree = false
      if (this.command == 'RECT') {
        this.activeFour = true
      } else {
        this.activeFour = false
      }
      clearTimeout(that.debounceTimeout3)
      that.debounceTimeout3 = setTimeout(() => {
        const allTexts = that.textLayer.getAllTexts()
        console.log(allTexts, '标题信息', that.savedJsonList)
        if (that.displayName == true) {
          allTexts.forEach((item) => {
            if (item.props.type != 'title') {
              that.textLayer.removeTextById(item.id)
            }
          })
          that.displayName = false
        } else if (that.displayName == false) {
          that.savedJsonList.forEach((item) => {
            if (item.shapeType == 1) {
              const text = new AILabel.Text(
                item.id,
                {
                  text: item.name,
                  position: {
                    // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                    // y: JSON.parse(item.parameters)[0].y,
                    x: JSON.parse(item.parameters)[0].x,
                    y: JSON.parse(item.parameters)[0].y,
                  },
                  // offset: { x: 0, y: 0 },
                  offset: { x: (item.name.length - 1) * -5, y: 0 },
                },
                // item.parameters.props, // props
                {
                  id: item.id,
                  name: item.name,
                  type: item.objectType,
                  zIndex: 100,
                  showName: true,
                },
                // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                {
                  font: 'normal 12px Arial',
                  zIndex: 5,
                  opacity: 1,
                  fillStyle: that.configData.backgroundColor,
                  fontColor: that.configData.fontColor,
                  textAlign: 'left',
                  background: that.configData.setBackground,
                  strokeStyle: that.configData.backgroundColor,
                  textBaseline: 'bottom',
                }
              )
              that.textLayer.addText(text)
            }
          })
          that.displayName = true
        }
        that.activeTwo = false
      }, 500)
    },
    goToMap(mapId) {
      var that = this
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      that.polyList = []
      that.deviceList = []
      that.gMap && that.gMap.markerLayer.removeAllMarkers()
      that.textLayer && that.textLayer.removeAllTexts()
      that.featureLayer && that.featureLayer.removeAllFeatures()
      that.gMap && that.gMap.removeLayerById('first-layer-image')
      // console.log('0f4b915604e9b0ec4fcbd45e1b28c6ec')
      let tempList = this.savedJsonList.filter((it) => it.id == mapId)
      console.log(tempList, 66)
      if (tempList.length == 1) {
        // this.imgUrl = 'http://192.168.1.175:8090' + tempList[0].thumbnailUrl
        this.imgUrl = tempList[0].thumbnailUrl
        that.operateList.push(tempList[0])
        sessionStorage.setItem('mapHistory', JSON.stringify(that.operateList))
        // this.initMap(mapId,tempList[0])
        var canvas = document.getElementById('imgDom')
        if (canvas) {
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.beginPath()
        }
        var canvas1 = document.getElementById('tempCanvas')
        if (canvas1) {
          var ctx1 = canvas1.getContext('2d')
          ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
          ctx1.beginPath()
        }
        var canvas2 = document.getElementById('myCanvas')
        if (canvas2) {
          var ctx2 = canvas2.getContext('2d')
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
          ctx2.beginPath()
        }
        this.showClip = false
        // this.gMap.markerLayer.removeAllMarkers()
        // this.textLayer.removeAllTexts()
        // this.featureLayer.removeAllFeatures()
        this.showToggleFloor = false
        this.showStationList = false
        // 查询父节点并给levelList赋值
        // getMapTree().then(mapTree => {
        //   console.log('地图树', mapTree)
        //   var findResult = that.findParentIdById(tempList[0].id, mapTree.data)
        //   if (findResult) {
        //     var parentResult = that.findParentIdById(findResult, mapTree.data)
        //     console.log('parentResult', parentResult)
        //     if (parentResult == "0") {
        //       that.levelList = []
        //     } else {
        //       that.levelList = []
        //       that.levelList.push(parentResult)
        //     }
        //   } else {
        //     that.levelList = []
        //   }
        // })
        this.initMap(
          tempList[0].objectLinkId,
          tempList,
          tempList[0].objectLinkId
        )
        // 创建地图容器
        // this.gMap = createMap1("map")
        // this.gMap.setMode("PAN")
        // addImage1(this.gMap, this.imgUrl, { width: this.$refs.container.offsetWidth, height: this.$refs.container.offsetHeight })
        // // 添加图形图层
        // this.featureLayer = addFeatureLayer(this.gMap, {}, { zIndex: 5 })
        // // 添加文本图层
        // this.textLayer = addTextLayer(this.gMap)
        // // 在图层上添加事件
        // this.addEvent(this.gMap, this.featureLayer, this.textLayer)
        // // 渲染已保存标签
        // getMapLabelList(tempList[0].objectLinkId).then((res) => {
        //   console.log("所有标签", res.data)
        //   this.savedJsonList = res.data
        //   this.savedJsonList.forEach((item) => {
        //     if (item.shapeType == 1) {
        //       console.log("TEXT")
        //       console.log(item.parameters.props)
        //       console.log(item.parameters.style)
        //       const text = new AILabel.Text(
        //         item.id,
        //         {
        //           text: item.name,
        //           position: {
        //             x:
        //               JSON.parse(item.parameters)[0].x -
        //               (item.name.length * 10) / 2,
        //             y: JSON.parse(item.parameters)[0].y,
        //           },
        //           offset: { x: 0, y: 0 },
        //         },
        //         { id: item.id, name: item.name, type: item.objectType, zIndex: 100, showName: true },
        //         {
        //           font: "normal 12px Arial",
        //           zIndex: 5,
        //           opacity: 1,
        //           fillStyle: "#0A72D1",
        //           fontColor: "#FFFFFF",
        //           textAlign: "left",
        //           background: true,
        //           strokeStyle: "#0A72D1",
        //           textBaseline: "bottom"
        //         }
        //       )
        //       this.textLayer.addText(text)
        //       let type = item.objectType
        //       let markerUrl = "./static/icon-camera.png"
        //       if (type == "camera") {
        //         markerUrl = "./static/icon-camera.png"
        //       } else if (type == "door") {
        //         markerUrl = "./static/icon-door.png"
        //       } else if (type == "defence") {
        //         markerUrl = "./static/icon-defence.png"
        //       } else if (type == "map") {
        //         markerUrl = "./static/icon-map.png"
        //       }
        //       const markerFeature = new AILabel.Marker(
        //         `feature-marker-${new Date().getTime()}`, // id
        //         {
        //           src: markerUrl,
        //           position: JSON.parse(item.parameters)[0],
        //         },
        //         { id: item.id, name: item.name, type: item.objectType, zIndex: 100, showName: true },
        //         item.parameters.style // style
        //       )
        //       this.gMap.markerLayer.addMarker(markerFeature)
        //       markerFeature.events.on("rightClick", (option) => {
        //         // this.cameraInfo = option
        //         // this.menuVisible = true
        //         // this.rightMenuStyle = {
        //         //   top: option.markerInfo.position.y + 100 + "px",
        //         //   left: option.markerInfo.position.x + "px",
        //         // }
        //         // this.rightMenuStyle = {
        //         //   top: 0 + "px",
        //         //   left: 0 + "px",
        //         // }
        //         // console.log(this.rightMenuStyle)
        //       })
        //       var clicked = false
        //       var clickTimeout
        //       markerFeature.events.on("click", (option) => {
        //         var c = document.getElementById("imgDom")
        //         var cxt = c.getContext("2d")
        //         cxt.clearRect(0, 0, c.width, c.height)
        //         console.log(option)
        //         console.log(option.props.type)
        //         this.targetFeature && this.featureLayer.removeFeatureById("target-rect")
        //         // 添加矩形选中框
        //         // this.targetFeature = addTargetRect(
        //         //   this.gMap,
        //         //   this.featureLayer,
        //         //   this.textLayer,
        //         //   markerFeature
        //         // )
        //         if (!clicked) {
        //           clicked = true
        //           clickTimeout = setTimeout(function () {
        //             clicked = false
        //           }, 300) // 设置双击间隔时间，这里设置为300毫秒
        //         } else {
        //           clearTimeout(clickTimeout)
        //           clicked = false
        //           // onDoubleClick() // 触发双击事件
        //           if (option.props.type == "camera") {
        //             // that.cameraObj = option.props
        //             // that.cameraVisible = true
        //             // that.$refs['videoMonitor'].dialogVisible = true
        //             // that.$refs['videoMonitor'].init(option.props.id)
        //             let objLinkId = this.savedJsonList.filter(it => it.id == option.props.id)
        //             var actionOne = { type: 103, isRealVideo: 1, data: [objLinkId[0].objectLinkId] }
        //             this.$parent.$parent.$parent.$parent.toOpenCamera(JSON.stringify(actionOne))
        //             // alert(111);
        //             // getDeviceInfo(option.props.id).then((res) => {
        //             //   that.cameraObj = res.data ? res.data : {}
        //             //   let row = res.data ? res.data : {}
        //             //   console.log(row)
        //             //   that.getUrl(row)
        //             // })
        //           } else if (option.props.type == "door") {
        //             that.doorVisible = true
        //           } else if (option.props.type == "defence") {
        //             that.defenceVisible = true
        //           } else if (option.props.type == "map") {
        //             console.log(option.props.id)
        //             that.goToMap(option.props.id)
        //             // that.$router.push({
        //             //   path: "/comprehensive-control/mapIndex",
        //             //   query: {
        //             //     id: option.props.id,
        //             //     isJump: that.$route.query.isJump
        //             //   },
        //             // })
        //           }
        //         }
        //         // this.cameraObj = option.props
        //         // this.cameraVisible = true
        //         // // alert(111);
        //         // getDeviceInfo(option.props.id).then((res) => {
        //         //   this.cameraObj = res.data ? res.data : {}
        //         //   let row = res.data ? res.data : {}
        //         //   console.log(row)
        //         //   that.getUrl(row)
        //         // })
        //         // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);//4月6日修改
        //         // this.keyDown(this.gMap, markerFeature, this.textLayer, option.props);
        //         // console.log(option);
        //         // this.cameraInfo = option;
        //         // this.targetFeature && this.featureLayer.removeFeatureById("target-rect");
        //         // // 添加矩形选中框
        //         // this.targetFeature = addTargetRect(
        //         //   this.gMap,
        //         //   this.featureLayer,
        //         //   this.textLayer,
        //         //   markerFeature
        //         // );
        //       })
        //       markerFeature.events.on("mouseOver", (option) => {
        //         // if (option.markerInfo.src !== this.markerHoverUrl) {
        //         //   gMap.markerLayer.removeMarkerById(option.id)
        //         //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerHoverUrl, props });
        //         // }
        //       })
        //       markerFeature.events.on("mouseOut", (option) => {
        //         // if (option.markerInfo.src !== this.markerUrl) {
        //         //   gMap.markerLayer.removeMarkerById(option.id)
        //         //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerUrl, props });
        //         // }
        //       })
        //       console.log(666)
        //       console.log(item.parameters.props)
        //       // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);
        //       // 4 月6日完成
        //     } else if (item.shapeType == 3) {
        //       const polygonFeature = new AILabel.Feature.Polygon(
        //         item.id,
        //         { points: JSON.parse(item.parameters) }, // shape
        //         // item.parameters.props, // props
        //         // item.parameters.style || {
        //         //   strokeStyle: "#00f",
        //         //   lineWidth: 2,
        //         //   fill: true,
        //         //   stroke: true,
        //         // } // style
        //         { props: null },
        //         {
        //           // strokeStyle: "rgba(0, 0, 0, 0)",
        //           // strokeStyle: "#f00",
        //           strokeStyle: "rgba(0, 0, 0, 0)",
        //           lineWidth: 2,
        //           fill: true,
        //           stroke: true,
        //         }
        //       )
        //       let featureId = item.id
        //       that.linkedList[featureId] = {
        //         type: "map",
        //         id: item.objectLinkId,
        //         name: item.name
        //       }
        //       this.featureLayer.addFeature(polygonFeature)
        //     }
        //   })
        //   this.updateAnimation(tempList[0].objectLinkId)
        // })

        // // 查询regionId
        // getLineMap(tempList[0].objectLinkId).then((res1) => {
        //   console.log(res1.data, 'region数据1')
        //   getLineTree(false, false).then(res2 => {
        //     that.regionData = res2.data
        //     that.addLevelToTree(that.regionData, 1)
        //     let findData = that.findItemById(that.regionData, res1.data.regionId)
        //     console.log(findData)
        //     const AncestorData = that.findAncestorWithLevel3(findData.id)
        //     console.log(AncestorData, '第三层的父级')
        //     if (findData.level == 1) {
        //       that.showStationList = false
        //       that.stationList = []
        //       that.stationIndex = -1
        //       that.showToggleFloor = false
        //       that.showToggleIndex = -1
        //       that.showToggleName = ""
        //     } else if (findData.level <= 3) {
        //       getPeerRegion(res1.data.regionId).then(res3 => {
        //         console.log(res3.data, '站点构造数据1')
        //         if (res3.data.length > 0) {
        //           that.showStationList = true
        //           that.stationList = res3.data
        //           that.stationIndex = that.stationList.findIndex(it => it.id == findData.id)
        //           let data = {
        //             regionId: res1.data.regionId,
        //             current: 1,
        //             size: -1,
        //             name: "",
        //             flag: false,
        //             type: ""
        //           }
        //           getMapByPage(data).then((res) => {
        //             let tempList = res.data.records.filter(it => it.deleteFlag == "0")
        //             function customSort (a, b) {
        //               if (a.type === b.type) {
        //                 return a.sort - b.sort
        //               } else {
        //                 return a.type - b.type
        //               }
        //               // return a.sort - b.sort
        //             }
        //             let resultList = tempList.sort(customSort)
        //             console.log(resultList, '哈哈哈4')
        //             var toggleAllFloorList = resultList
        //             sessionStorage.setItem("toggleAllFloorList", JSON.stringify(toggleAllFloorList))
        //             that.showToggleFloor = true
        //             that.showToggleName = toggleAllFloorList.find(item => item.id === resultList[0].id).name
        //             that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === resultList[0].id)
        //             that.toggleAllFloorList = toggleAllFloorList //修复bug
        //           })
        //         } else {
        //           that.showStationList = false
        //           that.stationList = []
        //           that.stationIndex = -1
        //         }
        //       })
        //     }
        //     // else {
        //     //   getPeerRegion(AncestorData.id).then(res3 => {
        //     //     console.log(res3.data, '站点构造数据2')
        //     //     if (res3.data.length > 0) {
        //     //       that.showStationList = true
        //     //       that.stationList = res3.data
        //     //       that.stationIndex = that.stationList.findIndex(it => it.id == AncestorData.id)
        //     //       let data = {
        //     //         regionId: res1.data.regionId,
        //     //         current: 1,
        //     //         size: -1,
        //     //         name: "",
        //     //         flag: true,
        //     //         type: ""
        //     //       }
        //     //       getMapByPage(data).then((res) => {
        //     //         let tempList = res.data.records.filter(it => it.deleteFlag == "0")
        //     //         function customSort (a, b) {
        //     //           if (a.type === b.type) {
        //     //             return a.sort - b.sort
        //     //           } else {
        //     //             return a.type - b.type
        //     //           }
        //     //           // return a.sort - b.sort
        //     //         }
        //     //         let resultList = tempList.sort(customSort)
        //     //         console.log(resultList)
        //     //         var toggleAllFloorList = resultList
        //     //         sessionStorage.setItem("toggleAllFloorList", JSON.stringify(toggleAllFloorList))
        //     //         that.showToggleFloor = true
        //     //         if (Array.isArray(listInfo)) {
        //     //           that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
        //     //           that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
        //     //         } else if (typeof listInfo === 'object') {
        //     //           that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo.objectLinkId).name
        //     //           that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo.objectLinkId)
        //     //         }
        //     //         // that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
        //     //         // that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
        //     //         that.toggleAllFloorList = toggleAllFloorList //修复bug
        //     //       })
        //     //     } else {
        //     //       that.showStationList = false
        //     //       that.stationList = []
        //     //       that.stationIndex = -1
        //     //     }
        //     //   })
        //     //   // 结束
        //     // }
        //   })
        // })
        //查询结束
      }
    },
    findParentIdById(id, data) {
      for (const item of data) {
        if (item.id === id) {
          return item.parentId // 找到对应id的项，返回其children
        } else if (item.children && item.children.length > 0) {
          const found = this.findParentIdById(id, item.children) // 递归查找子项
          if (found) {
            return found // 如果找到，直接返回
          }
        }
      }
      return null // 如果未找到则返回null
    },
    //树节点根据指定id找出其children
    findChildrenById(id, data) {
      for (const item of data) {
        if (item.id === id) {
          return item.children // 找到对应id的项，返回其children
        } else if (item.children && item.children.length > 0) {
          const found = this.findChildrenById(id, item.children) // 递归查找子项
          if (found) {
            return found // 如果找到，直接返回
          }
        }
      }
      return null // 如果未找到，返回null或其他你认为合适的值
    },
    createScene() {
      scene.background = new THREE.Color('#172333')
    },
    createCamera() {
      const element = document.getElementById('vr01')
      const width = element.offsetWidth // 窗口宽度
      const height = element.offsetHeight // 窗口高度
      const k = width / height // 窗口宽高比
      camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)
      // camera.position.z = 3
      // 设置初始相机位置
      camera.position.set(
        initialCameraPosition.x,
        initialCameraPosition.y,
        initialCameraPosition.z
      )
      camera.lookAt(0, 0, 0) // 确保相机朝向场景中心
      scene.add(camera)
    },
    createRender() {
      const element = document.getElementById('vr01')
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      element.appendChild(renderer.domElement)
    },
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
      const originalRotate = controls.rotate
      controls.rotate = (deltaX, deltaY) => {
        originalRotate.call(controls, deltaX, deltaY)
      }
    },
    createModel(row) {
      return new Promise((resolve, reject) => {
        if (!row.url) {
          console.warn('全景图 URL 无效，无法加载 VR 图')
          reject('无效的 URL')
          return
        }
        if (this.sphereTexture) {
          this.sphereTexture.dispose()
          this.sphereTexture = null
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
            // if (renderer) {
            //   this.sphereTexture.minFilter = THREE.LinearMipmapLinearFilter
            //   this.sphereTexture.magFilter = THREE.LinearFilter
            //   this.sphereTexture.generateMipmaps = true
            //   this.sphereTexture.anisotropy =
            //     renderer.capabilities.getMaxAnisotropy()
            //   this.sphereTexture.needsUpdate = true
            // }

            let sphere_material = new THREE.MeshStandardMaterial({
              map: this.sphereTexture,
              side: THREE.DoubleSide, // 双面渲染
            })
            sphere_material.map.colorSpace = 'srgb'
            sphere_geometry.scale(1, 1, -1)
            this.sphere = new THREE.Mesh(sphere_geometry, sphere_material)
            scene.add(this.sphere)
            // 初始缩放为 0
            this.sphere.scale.set(0.5, 0.5, 0.5)

            // 动画放大
            gsap.to(this.sphere.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 1.2,
              ease: 'power2.out',
            })
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
    createPoint() {
      // 遍历监控点数据并创建
      if (this.dataList.label && this.dataList.label.length > 0) {
        this.dataList.label.forEach((label) => {
          const texLoader = new THREE.TextureLoader()
          const cameraTexture = require('@/assets/images/kanas/control-camera-click.png')
          const envTexture = require('@/assets/images/environment.png')
          const texturePath =
            label.type === 'environmentChannel' ? envTexture : cameraTexture
          const texture = texLoader.load(texturePath)
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
          const texture = texLoader.load(require('@/assets/images/link.png'))
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
          const texture = texLoader.load(require('@/assets/images/label.png'))
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
    createLight() {
      // 清除场景中已有的灯光
      const lights = scene.children.filter((child) => child.isLight)
      lights.forEach((light) => scene.remove(light))

      // 添加新的灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 2) // 创建环境光
      scene.add(ambientLight) // 将环境光添加到场景
    },
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
    render() {
      var that = this
      if (this.renderId) {
        cancelAnimationFrame(this.renderId)
        this.renderId = null
      }
      // this.renderId = requestAnimationFrame(this.render)
      this.renderId = requestAnimationFrame(() => this.render())
      // renderer.render(scene, camera)
      // 检查纹理是否加载完成
      // TWEEN.update()
      if (
        this.sphereTexture &&
        this.sphereTexture.image &&
        this.sphereTexture.image.complete
      ) {
        renderer.render(scene, camera)
      }
      controls && controls.update()
      this.getCameraPosition()
    },
    getExtensionAngle(extension) {
      const angle = Number(extension.angle) || 0
      const direction = extension.directionPair

      switch (direction) {
        case '北偏东':
          return angle
        case '北偏西':
          return (360 - angle) % 360
        case '南偏东':
          return (180 - angle + 360) % 360
        case '南偏西':
          return (180 + angle) % 360
        default:
          return 0
      }
    },
    getCameraPosition() {
      // 获取相机的旋转四元数

      let rotation = camera.quaternion.clone()

      // 转换为欧拉角（用rotation取特定轴上的旋转角度）

      let euler = new THREE.Euler().setFromQuaternion(rotation, 'YXZ')

      // // 获取绕z轴的旋转角度（转换为度）

      let currentRotZ = THREE.MathUtils.radToDeg(-euler.y)
      // 加上人工方向偏移
      const extensionAngle = this.getExtensionAngle(this.extension)
      const totalAngle = (currentRotZ + extensionAngle + 360) % 360
      this.currentRotZ = totalAngle
    },
    // 初始化VR图
    async initVR(row) {
      var that = this
      // 确保场景和核心对象存在
      console.log(row, 'vr数据')
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
      }
      // 重置相机位置和控制器目标
      camera.position.set(
        initialCameraPosition.x,
        initialCameraPosition.y,
        initialCameraPosition.z
      )
      camera.lookAt(0, 0, 0) // 确保相机朝向场景中心

      if (controls) {
        controls.target.set(0, 0, 0) // 设置控制器目标为场景中心
        controls.update() // 更新控制器
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
      if (cameraGroup) cameraGroup.clear()
      if (linkGroup) linkGroup.clear()
      if (markerGroup) markerGroup.clear()
      if (textGroup) textGroup.clear()

      try {
        // 等待模型加载完成
        await this.createModel(row)
        // 创建点位和光源
        this.createPoint()
        this.createLight()
      } catch (error) {
        console.error('初始化失败:', error)
      } finally {
        this.render()
        setTimeout(() => {
          if (sessionStorage.getItem('hightlightInfo')) {
            let hightlightInfo = JSON.parse(
              sessionStorage.getItem('hightlightInfo')
            )
            let cameraId = hightlightInfo.labels[0].objectLinkId
            // 1. VR图里找目标点坐标
            const cameraData = that.dataList.label.find(
              (item) => item.id === cameraId
            )
            const pos = new THREE.Vector3(
              cameraData.x,
              cameraData.y,
              cameraData.z
            )

            // 2. 单位方向向量
            const dir = pos.clone().normalize()

            // 3. 镜像对称点（相机新位置方向）
            const mirroredDir = dir.clone().negate()

            // 4. 原始相机距离
            const radius = camera.position.length()

            // 5. 新相机位置
            const newCamPos = mirroredDir.multiplyScalar(radius)

            // 6. 动画
            gsap.to(camera.position, {
              x: newCamPos.x,
              y: newCamPos.y,
              z: newCamPos.z,
              duration: 1.2,
              onUpdate: () => {
                camera.lookAt(0, 0, 0)
                controls.target.set(0, 0, 0)
                controls.update()
              },
              onComplete: () => {
                that.highlightCameraSprite(cameraId)
                // 不移除 sessionStorage.removeItem('hightlightInfo')
              },
            })
          }
        }, 0)
      }
      // 开始渲染
      // this.render()
      const container = document.getElementById('vr01')
      if (container) {
        container.removeEventListener('dblclick', this.dblClickEvent)
        container.addEventListener('dblclick', this.dblClickEvent)
        // container.removeEventListener('click', this.onClick)
        // container.addEventListener('click', this.onClick)
      }
      window.removeEventListener('resize', this.onResize)
      window.addEventListener('resize', this.onResize)
      this.updateVrAnimation()
      // sessionStorage.setItem('lastMapID', row.id)
    },
    dblClickEvent(event) {
      event.preventDefault()

      // 获取鼠标在容器中的位置
      const container = document.getElementById('vr01')
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
        console.log('双击的图标数据:', userData)

        // 判断图标类型并执行相应操作
        if (cameraGroup.children.includes(intersectedObject)) {
          console.log('双击了相机图标')
          this.handleOpenCamera(userData)
        } else if (linkGroup.children.includes(intersectedObject)) {
          console.log('双击了漫游点图标')
          this.handleOpenVr(userData, intersectedObject)
        } else if (markerGroup.children.includes(intersectedObject)) {
          console.log('双击了标注点图标')
          this.handleOpenVr(userData, intersectedObject)
          // this.handleOpenImage(userData)
        }
      } else {
        console.log('双击未命中任何图标')
      }
    },
    // handleOpenImage(row) {
    //   this.previewImageList = []
    //   // let imgUrl = 'http://192.168.1.175:8090' + [row.url]
    //   this.previewImageList.push(row.url)
    //   this.dialogImageVisible = true
    // },
    // handleCloseImage() {
    //   this.previewImageList = []
    //   this.dialogImageVisible = false
    // },
    handleOpenCamera(row) {
      if (row.type == 'environmentChannel') {
        this.$emit('setEnvironmentId', true, row.id, that.currentUrlRealUrl)
      } else {
        this.realDialogVisible = true
        this.$nextTick(() => {
          this.$refs['realVideoRef'].getLiveUrl(row.id)
        })
      }
      // let actionOne = {
      //   type: 103,
      //   isRealVideo: 1,
      //   startPosition: 'centerScreen',
      //   cameraIds: [row.id],
      //   data: [row.id],
      // }
      // this.$parent.$parent.$parent.$parent.toOpenCamera(JSON.stringify(actionOne))
    },
    handleCloseCamera() {
      this.realDialogVisible = false
    },
    // handleOpenVr(row, intersectedObject) {
    //   var that = this
    //   var mapId = row.linkMapId
    //   // 防止重复触发动画
    //   getLineMap(mapId).then((res999) => {
    //     that.imgUrl = res999.data.picUrl
    //     if (TWEEN.getAll().length > 0) return

    //     // 获取目标漫游点位置
    //     const targetPos = new THREE.Vector3(
    //       intersectedObject.position.x / 2,
    //       intersectedObject.position.y / 2,
    //       intersectedObject.position.z / 2
    //     )

    //     // 创建相机位置的补间动画
    //     new TWEEN.Tween(camera.position)
    //       .to(
    //         {
    //           x: targetPos.x,
    //           y: targetPos.y,
    //           z: targetPos.z, // 与漫游点保持距离
    //         },
    //         600
    //       )
    //       .easing(TWEEN.Easing.Quadratic.InOut)
    //       .onUpdate(() => {
    //         // 确保相机始终朝向漫游点
    //         camera.lookAt(targetPos)
    //       })
    //       .onComplete(() => {
    //         // 动画完成后加载新的VR场景
    //         console.log(row, 'row参数')
    //         window.removeEventListener('resize', that.onResize)
    //         const container = document.getElementById('vr01')
    //         if (container) {
    //           container.removeEventListener('dblclick', that.dblClickEvent)
    //         }
    //         if (res999.data.mapType === 1) {
    //           that.showVR = false
    //           that.gMap && that.gMap.markerLayer.removeAllMarkers()
    //           that.gMap && that.textLayer.removeAllTexts()
    //           that.gMap && that.featureLayer.removeAllFeatures()
    //           that.gMap && that.gMap.removeLayerById('first-layer-image')
    //           that.gMap && that.gMap.destroy()
    //           if (that.viewer) {
    //             // 清空所有 primitives (包括模型)
    //             that.viewer.scene.primitives.removeAll()
    //             // 销毁 Cesium Viewer
    //             that.viewer.destroy()
    //             that.viewer = null
    //           }
    //           // 释放渲染器
    //           if (renderer) {
    //             renderer.dispose()
    //             renderer.forceContextLoss()
    //             renderer.domElement = null
    //             renderer = null
    //           }

    //           // 清空场景中的对象
    //           scene.traverse((object) => {
    //             if (object.geometry) {
    //               object.geometry.dispose()
    //             }
    //             if (object.material) {
    //               if (Array.isArray(object.material)) {
    //                 object.material.forEach((material) => material.dispose())
    //               } else {
    //                 object.material.dispose()
    //               }
    //             }
    //           })
    //           scene.clear()

    //           // 清空 Group 对象内容
    //           if (cameraGroup) cameraGroup.clear()
    //           if (linkGroup) linkGroup.clear()
    //           if (markerGroup) markerGroup.clear()
    //           if (textGroup) textGroup.clear()

    //           // 清空 dataList 数据
    //           that.dataList.marker = []
    //           that.dataList.link = []
    //           that.dataList.label = []

    //           // 释放纹理
    //           if (that.sphereTexture) {
    //             that.sphereTexture.dispose()
    //             that.sphereTexture = null
    //           }

    //           // 释放控件
    //           if (controls) {
    //             controls.dispose()
    //             controls = null
    //           }

    //           // 清空 sphere
    //           if (that.sphere) {
    //             scene.remove(that.sphere) // 从场景中移除
    //             if (that.sphere.geometry) that.sphere.geometry.dispose() // 释放几何体
    //             if (that.sphere.material) that.sphere.material.dispose() // 释放材质
    //             that.sphere = null
    //           }

    //           // 停止渲染循环
    //           if (that.renderId) {
    //             cancelAnimationFrame(that.renderId)
    //             that.renderId = null
    //           }
    //           that.initMap(mapId, res999.data)
    //         } else if (res999.data.mapType === 2) {
    //           that.showVR = true
    //           that.initMap(mapId, res999.data)
    //         }
    //       })
    //       .start()

    //     // 更新控制器目标点
    //     controls.target.copy(
    //       new THREE.Vector3(
    //         intersectedObject.position.x,
    //         intersectedObject.position.y,
    //         intersectedObject.position.z
    //       )
    //     )
    //     controls.update()
    //   })
    // },
    handleOpenVr(row, intersectedObject) {
      const that = this
      const mapId = row.linkMapId

      getLineMap(mapId).then((res999) => {
        that.imgUrl = res999.data.picUrl

        // 获取目标漫游点位置（注意是缩小一半的位置）
        const targetPoint = new THREE.Vector3(
          intersectedObject.position.x / 2,
          intersectedObject.position.y / 2,
          intersectedObject.position.z / 2
        )

        // 相机当前的位置
        const startPos = camera.position.clone()

        // 移动方向
        const moveDirection = new THREE.Vector3()
          .subVectors(targetPoint, startPos)
          .normalize()

        // 相机动画结束的位置（略偏后）
        const offsetDistance = 0.5
        const endPos = targetPoint
          .clone()
          .addScaledVector(moveDirection.clone().negate(), offsetDistance)

        // 禁用控制器
        controls.enabled = false

        const temp = { t: 0 }
        gsap.to(temp, {
          duration: 1.0,
          t: 1,
          ease: 'power2.inOut',
          onUpdate: () => {
            camera.position.lerpVectors(startPos, endPos, temp.t)

            // 在动画过程中保持朝向前进方向
            const lookAtPos = camera.position.clone().add(moveDirection)
            camera.lookAt(lookAtPos)
          },
          onComplete: () => {
            // 最终朝向目标点
            camera.lookAt(targetPoint)
            controls.target.copy(targetPoint)
            controls.enabled = true
            controls.update()

            // 清理原有事件监听
            window.removeEventListener('resize', that.onResize)
            const container = document.getElementById('vr01')
            if (container) {
              container.removeEventListener('dblclick', that.dblClickEvent)
            }

            // 切换地图
            if (res999.data.mapType === 1) {
              var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
              mapHistory.push(res999.data)
              sessionStorage.setItem('mapHistory', JSON.stringify(mapHistory))
              that.showVR = false
              that.gMap?.markerLayer.removeAllMarkers()
              that.textLayer && that.textLayer.removeAllTexts()
              that.featureLayer && that.featureLayer.removeAllFeatures()
              that.gMap?.removeLayerById('first-layer-image')
              that.gMap?.destroy()

              if (that.viewer) {
                that.viewer.scene.primitives.removeAll()
                that.viewer.destroy()
                that.viewer = null
              }

              if (renderer) {
                renderer.dispose()
                renderer.forceContextLoss()
                renderer.domElement = null
                renderer = null
              }

              scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose()
                if (object.material) {
                  if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => mat.dispose())
                  } else {
                    object.material.dispose()
                  }
                }
              })
              scene.clear()

              cameraGroup?.clear()
              linkGroup?.clear()
              markerGroup?.clear()
              textGroup?.clear()

              that.dataList.marker = []
              that.dataList.link = []
              that.dataList.label = []

              if (that.sphereTexture) {
                that.sphereTexture.dispose()
                that.sphereTexture = null
              }

              if (controls) {
                controls.dispose()
                controls = null
              }

              if (that.sphere) {
                scene.remove(that.sphere)
                that.sphere.geometry?.dispose()
                that.sphere.material?.dispose()
                that.sphere = null
              }

              if (that.renderId) {
                cancelAnimationFrame(that.renderId)
                that.renderId = null
              }

              that.initMap(mapId, res999.data)
            } else if (res999.data.mapType === 2) {
              var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
              mapHistory.push(res999.data)
              sessionStorage.setItem('mapHistory', JSON.stringify(mapHistory))
              that.showVR = true
              that.initMap(mapId, res999.data)
            }
          },
        })

        // 可选：FOV 动画（视觉增强）
        const startFov = camera.fov
        gsap.to(camera, {
          fov: startFov - 5,
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
          onUpdate: () => {
            camera.updateProjectionMatrix()
          },
        })
      })
    },
    // 初始化地图
    initMap(mapId, listInfo, thirdId, positionInfo) {
      // alert(this.imgUrl)
      // this.imgUrl = this.imgUrl
      // if (!this.imgUrl.startsWith('http://192.168.1.175:8090')) {
      //   this.imgUrl = 'http://192.168.1.175:8090' + this.imgUrl
      // }
      // this.imgUrl = 'http://192.168.1.175:8090' + this.imgUrl
      var that = this
      console.log(mapId, '*************1')
      console.log(listInfo, '**************2')
      console.log(thirdId, '***************3')
      console.log(positionInfo, '***********4')
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      that.currentMapId = mapId
      getBackByMapId(that.currentMapId).then((res111) => {
        console.log(res111.data, '右上角返回数据')
        if (res111.data && res111.data.length > 0) {
          that.hasBack = true
        } else {
          that.hasBack = false
        }
      })
      sessionStorage.setItem('lastMapID', mapId)
      if (that.gMap) {
        // const allMarkers = that.gMap.getAllMarkers();
        // console.log(that.gMap.markerLayer)
        that.gMap && that.gMap.markerLayer.removeAllMarkers()
        that.textLayer && that.textLayer.removeAllTexts()
        that.featureLayer && that.featureLayer.removeAllFeatures()
        that.gMap && that.gMap.removeLayerById('first-layer-image')
        that.gMap && that.gMap.destroy()
        that.gMap = null
        // console.log(that.gMap.markerLayer)
        // this.gMap.markerLayer.removeMarkerById(cameraInfo.id)
        // that.markerList.forEach(it => {
        //   console.log(it, '***')
        //   that.gMap.markerLayer.removeMarkerById(it)
        // })
      }
      var canvas = document.getElementById('imgDom')
      if (canvas) {
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
      }
      var canvas1 = document.getElementById('tempCanvas')
      if (canvas1) {
        var ctx1 = canvas1.getContext('2d')
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
        ctx1.beginPath()
      }
      var canvas2 = document.getElementById('myCanvas')
      if (canvas2) {
        var ctx2 = canvas2.getContext('2d')
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
        ctx2.beginPath()
      }

      //如果是VR图片，使用threejs加载VR图片，否则执行添加平面图
      getLineMap(mapId).then((res999) => {
        console.log(res999.data, '当前图数据？？？')
        that.operateList.push(res999.data)
        if (res999.data.mapType === 2) {
          that.showVR = true
          that.extension = res999.data.extension
            ? JSON.parse(res999.data.extension)
            : {
                angle: 0,
                directionPair: '北偏东',
              }
          // 获取VR图上标签开始
          getMapLabelList(mapId)
            .then((res888) => {
              that.savedJsonList = res888.data
              let dataList
              if (res888.data.length > 0) {
                dataList = JSON.parse(res888.data[0].parameters)
                // dataList.url = 'http://192.168.1.175:8090' + dataList.url
              } else {
                dataList = {
                  id: res999.data.id,
                  name: res999.data.name,
                  url: res999.data.picUrl,
                  // url: 'http://192.168.1.175:8090' + res999.data.picUrl,
                  link: [],
                  marker: [],
                  label: [],
                }
              }
              let environmentList2 = res888.data.filter(
                (it) => it.objectType === 'environmentChannel'
              )
              let cameraRealList2 = res888.data.filter(
                (it) => it.objectType === 'camera'
              )
              if (environmentList2.length > 0) {
                that.enableEnvironment = true
                that.environmentId = environmentList2[0].objectLinkId
                if (cameraRealList2.length > 0) {
                  that.realCameraId = cameraRealList2[0].objectLinkId
                  getLiveUrls(that.realCameraId, 'ws', true)
                    .then((result) => {
                      if (result.code == 200) {
                        let url =
                          result.data && result.data.url ? result.data.url : ''
                        that.currentUrlRealUrl = url
                        that.$emit(
                          'setEnvironmentId',
                          true,
                          environmentList2[0].objectLinkId,
                          url
                        )
                      } else {
                        that.currentUrlRealUrl = ''
                        that.$emit(
                          'setEnvironmentId',
                          true,
                          environmentList2[0].objectLinkId,
                          ''
                        )
                      }
                    })
                    .catch((error) => {
                      console.error('获取实时视频地址失败:', error)
                      that.$emit(
                        'setEnvironmentId',
                        true,
                        environmentList2[0].objectLinkId,
                        ''
                      )
                    })
                } else {
                  that.$emit(
                    'setEnvironmentId',
                    true,
                    environmentList2[0].objectLinkId,
                    ''
                  )
                }
              } else {
                that.enableEnvironment = false
                that.environmentId = ''
                that.$emit('setEnvironmentId', false, '', '')
              }
              that.dataList = dataList
              if (
                res999.data &&
                res999.data.miniMapId &&
                res999.data.miniMapId != null &&
                res999.data.miniMapId != 'null'
              ) {
                getLineMap(res999.data.miniMapId).then((res) => {
                  that.thumbImg = res.data.picUrl
                  // that.thumbImg = 'http://192.168.1.175:8090' + res.data.picUrl
                  getMapLabelList(res999.data.miniMapId).then((resLabel) => {
                    let rightTopList = resLabel.data.filter(
                      (it) =>
                        it.shapeType == 1 &&
                        it.objectType == 'map' &&
                        it.objectLinkId === mapId &&
                        it.parameters != null
                    )
                    if (rightTopList.length > 0) {
                      console.log(rightTopList, rightTopList[0].parameters)
                      let positionArg = JSON.parse(rightTopList[0].parameters)
                      var img1 = new Image()
                      img1.crossOrigin = ''
                      img1.src = that.thumbImg
                      img1.onload = function () {
                        that.thumbx = positionArg[0].x / img1.width
                        that.thumby = positionArg[0].y / img1.height
                        that.thumbName = rightTopList[0].name
                        console.log('thumbx:', that.thumbx, typeof that.thumbx)
                        console.log('thumby:', that.thumby, typeof that.thumby)
                        let markerList = resLabel.data.filter(
                          (it) =>
                            it.shapeType == 1 &&
                            it.objectType == 'map' &&
                            it.objectLinkId !== mapId &&
                            it.parameters != null
                        )
                        if (markerList.length > 0) {
                          markerList.forEach((item) => {
                            item.thumbx =
                              JSON.parse(item.parameters)[0].x / img1.width
                            item.thumby =
                              JSON.parse(item.parameters)[0].y / img1.height
                          })
                          that.markerList = markerList
                          console.log('markerList', that.markerList)
                        } else {
                          this.markerList = []
                        }
                      }
                    } else {
                      that.thumbx = false
                      that.thumby = false
                    }
                  })
                })
              } else {
                that.thumbImg = ''
              }
              that.initVR(dataList)
              getMapTree().then((mapTree) => {
                console.log('地图树3', mapTree)
                var findResult = that.findParentIdById(mapId, mapTree.data)
                if (findResult) {
                  var parentResult = that.findParentIdById(
                    findResult,
                    mapTree.data
                  )
                  console.log('parentResult3', parentResult)
                  if (parentResult == '0') {
                    that.levelList = []
                  } else {
                    that.levelList = []
                    that.levelList.push(parentResult)
                  }
                } else {
                  that.levelList = []
                }
              })
              // 查询regionId
              getLineMap(mapId).then((res1) => {
                console.log(res1.data, 'region数据3')
                getLineTree(false, false).then((res2) => {
                  that.regionData = res2.data
                  that.addLevelToTree(that.regionData, 1)
                  let findData = that.findItemById(
                    that.regionData,
                    res1.data.regionId
                  )
                  console.log(findData)
                  const AncestorData = that.findAncestorWithLevel3(findData.id)
                  console.log(AncestorData, '第三层的父级')
                  if (findData.level == 1) {
                    // that.showStationList = false
                    // that.stationList = []
                    // that.stationIndex = -1
                    that.showToggleFloor = false
                    that.showToggleIndex = -1
                    that.showToggleName = ''
                    if (res1.data.showLine == false) {
                      that.showStationList = false
                      that.stationList = []
                      that.stationIndex = -1
                    } else {
                      getPeerRegion(findData.id).then((res3) => {
                        console.log(res3.data, '站点构造数据222')
                        if (res3.data.length > 0) {
                          that.showStationList = true
                          that.stationList = res3.data
                          that.stationIndex = that.stationList.findIndex(
                            (it) => it.id == findData.id
                          )
                        } else {
                          that.showStationList = false
                          that.stationList = []
                          that.stationIndex = -1
                        }
                      })
                    }
                  } else if (findData.level <= 3) {
                    getPeerRegion(res1.data.regionId).then((res3) => {
                      console.log(res3.data, '站点构造数据3')
                      if (res3.data.length > 0) {
                        that.stationList = res3.data
                        that.stationIndex = that.stationList.findIndex(
                          (it) => it.id == findData.id
                        )
                        let data = {
                          regionId: res1.data.regionId,
                          current: 1,
                          size: -1,
                          name: '',
                          flag: false,
                          type: '',
                        }
                        getMapByPage(data).then((res) => {
                          let tempList = res.data.records.filter(
                            (it) => it.deleteFlag == '0'
                          )
                          function customSort(a, b) {
                            if (a.type === b.type) {
                              return a.sort - b.sort
                            } else {
                              return a.type - b.type
                            }
                            // return a.sort - b.sort
                          }
                          let resultList = tempList.sort(customSort)
                          console.log(resultList, '楼层图1')
                          console.log(listInfo, 'listInfo')
                          var toggleAllFloorList = resultList
                          sessionStorage.setItem(
                            'toggleAllFloorList',
                            JSON.stringify(toggleAllFloorList)
                          )
                          that.showToggleFloor = true
                          if (listInfo) {
                            if (Array.isArray(listInfo)) {
                              that.showToggleIndex =
                                toggleAllFloorList.findIndex(
                                  (item) => item.id === listInfo[0].objectLinkId
                                )
                            } else {
                              that.showToggleIndex =
                                toggleAllFloorList.findIndex(
                                  (item) => item.id === listInfo.id
                                )
                            }
                            that.showToggleName =
                              toggleAllFloorList[that.showToggleIndex].name
                          } else {
                            that.showToggleName = toggleAllFloorList.find(
                              (item) => item.id === resultList[0].id
                            ).name
                            that.showToggleIndex = toggleAllFloorList.findIndex(
                              (item) => item.id === resultList[0].id
                            )
                          }
                          that.toggleAllFloorList = toggleAllFloorList //修复bug
                          if (res1.data.showLine == false) {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                          } else {
                            that.showStationList = true
                          }
                        })
                      } else {
                        that.showStationList = false
                        that.stationList = []
                        that.stationIndex = -1
                        that.showToggleFloor = false
                        that.toggleAllFloorList = []
                        that.showToggleIndex = -1
                        if (res1.data.showLine == false) {
                          that.showStationList = false
                          that.stationList = []
                          that.stationIndex = -1
                        }
                      }
                    })
                  } else {
                    getPeerRegion(AncestorData.id).then((res3) => {
                      console.log(res3.data, '站点构造数据22222')
                      if (res3.data.length > 0) {
                        that.stationList = res3.data
                        that.stationIndex = that.stationList.findIndex(
                          (it) => it.id == AncestorData.id
                        )
                        let data = {
                          regionId: res1.data.regionId,
                          current: 1,
                          size: -1,
                          name: '',
                          flag: true,
                          type: '',
                        }
                        getMapByPage(data).then((res) => {
                          let tempList = res.data.records.filter(
                            (it) => it.deleteFlag == '0'
                          )
                          function customSort(a, b) {
                            if (a.type === b.type) {
                              return a.sort - b.sort
                            } else {
                              return a.type - b.type
                            }
                            // return a.sort - b.sort
                          }
                          let resultList = tempList.sort(customSort)
                          var toggleAllFloorList = resultList
                          sessionStorage.setItem(
                            'toggleAllFloorList',
                            JSON.stringify(toggleAllFloorList)
                          )
                          that.showToggleFloor = true
                          if (Array.isArray(listInfo)) {
                            that.showToggleName = toggleAllFloorList.find(
                              (item) => item.id === listInfo[0].objectLinkId
                            ).name
                            that.showToggleIndex = toggleAllFloorList.findIndex(
                              (item) => item.id === listInfo[0].objectLinkId
                            )
                          } else if (typeof listInfo === 'object') {
                            that.showToggleName = toggleAllFloorList.find(
                              (item) => item.id === mapId
                            ).name
                            that.showToggleIndex = toggleAllFloorList.findIndex(
                              (item) => item.id === mapId
                            )
                          }
                          // that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
                          // that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
                          that.toggleAllFloorList = toggleAllFloorList //修复bug
                          if (res1.data.showLine == false) {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                          } else {
                            that.showStationList = true
                          }
                        })
                      } else {
                        that.showStationList = false
                        that.stationList = []
                        that.stationIndex = -1
                        // if (res1.data.showLine == false) {
                        //   that.showStationList = false
                        //   that.stationList = []
                        //   that.stationIndex = -1
                        // }
                      }
                    })
                  }
                  // if (res1.data.showLine == false) {
                  //   alert(666)
                  //   that.showStationList = false
                  //   that.stationList = []
                  //   that.stationIndex = -1
                  // }
                })
              })
            })
            .catch((err) => {
              // 错误处理
              console.error('错误:', err)
            })
            .finally(() => {
              // 无论成功或失败都会执行
              // if (sessionStorage.getItem('hightlightInfo')) {
              //   let hightlightInfo = JSON.parse(
              //     sessionStorage.getItem('hightlightInfo')
              //   )
              //   sessionStorage.removeItem('hightlightInfo')
              //   if (that.showVR) {
              //     that.highlightCameraSprite(
              //       hightlightInfo.labels[0].objectLinkId
              //     )
              //   } else {
              //     that.targetFeature && that.featureLayer.removeFeatureById('target-rect')
              //     that.targetFeature = null
              //     that.targetFeature = addTargetRect(
              //       that.gMap,
              //       that.featureLayer,
              //       that.textLayer,
              //       {
              //         props: {
              //           id: hightlightInfo.labels[0].objectLinkId,
              //           showName: false,
              //           name: hightlightInfo.labels[0].name,
              //         },
              //         markerInfo: {
              //           position: {
              //             x: JSON.parse(hightlightInfo.labels[0].parameters)[0]
              //               .x,
              //             y: JSON.parse(hightlightInfo.labels[0].parameters)[0]
              //               .y,
              //           },
              //         },
              //       }
              //     )
              //   }
              // }
            })
          // 获取VR图上标签结束
        } else if (res999.data.mapType === 1) {
          that.extension = {}
          // 创建地图容器
          that.imgUrl = res999.data.picUrl
          // if (!that.imgUrl.startsWith('http://192.168.1.175:8090')) {
          //   that.imgUrl = 'http://192.168.1.175:8090' + that.imgUrl
          // }
          that.showVR = false
          that.gMap && that.gMap.markerLayer.removeAllMarkers()
          that.textLayer && that.textLayer.removeAllTexts()
          that.featureLayer && that.featureLayer.removeAllFeatures()
          that.gMap && that.gMap.removeLayerById('first-layer-image')
          that.gMap && that.gMap.destroy()
          that.gMap = null
          that.gMap = createMap1('map01')
          console.log(that.gMap)
          addImage1(that.gMap, that.imgUrl, {
            width: that.$refs.container.offsetWidth,
            height: that.$refs.container.offsetHeight,
          })
          // 添加图形图层
          that.featureLayer = addFeatureLayer(that.gMap, {}, { zIndex: 5 })
          that.featureLayer.removeAllFeatures()
          // 添加文本图层
          that.textLayer = addTextLayer(that.gMap)
          that.textLayer.removeAllTexts()
          // // 在图层上添加事件 放到标签及图形回显之后
          // that.addEvent(that.gMap, that.featureLayer, that.textLayer)
          // this.getHistoryData();
          // 渲染已保存标签
          var img = new Image()
          img.crossOrigin = ''
          // img.src = 'http://192.168.1.175:8090' + that.imgUrl
          img.src = that.imgUrl
          that.tempScale = that.gMap.getScale() / that.firstScale + 0.002
          that.leftOrigin =
            (that.gMap.getCenter().x * that.gMap.getScale() -
              that.firstPosition.x * that.firstScale) *
            -1
          that.rightOrigin =
            (that.gMap.getCenter().y * that.gMap.getScale() -
              that.firstPosition.y * that.firstScale) *
            -1
          img.onload = function () {
            // var parts = that.imgUrl.split('.')
            // var fileExtension = parts[parts.length - 1].toLowerCase()
            // if (fileExtension == 'svg') {
            //   // 如果是 SVG 图片，使用 getBBox 获取准确的宽度和高度
            //   // alert(img.width)
            //   // alert(img.height)
            //   // console.log(img);
            // }
            // console.log(img)
            var scaleFactor = Math.min(
              that.containerWidth / img.width,
              that.containerHeight / img.height
            )
            that.scaleFactor = scaleFactor
            if (
              img.width / img.height <
              that.containerWidth / that.containerHeight
            ) {
              that.canvasContainerWidth = Math.round(
                img.width * (that.containerHeight / img.height)
              )
              that.canvasContainerHeight = that.containerHeight
              that.left = Math.round(
                (that.containerWidth - that.canvasContainerWidth) / 2
              )
              that.top = 0
            } else {
              that.canvasContainerWidth = that.containerWidth
              that.canvasContainerHeight = Math.round(
                img.height * (that.containerWidth / img.width)
              )
              that.left = 0
              that.top = Math.round(
                (that.containerHeight - that.canvasContainerHeight) / 2
              )
            }
            if (thirdId) {
              getMapLabelList(thirdId)
                .then((res) => {
                  console.log('所有标签111111111', res.data)
                  that.allCameraMarkers = []
                  console.log('that.scaleFactor', that.scaleFactor)
                  console.log('that.currentScale', that.currentScale)
                  console.log('that.currentZoom', that.currentZoom)
                  that.savedJsonList = res.data
                  let environmentList3 = res.data.filter(
                    (it) => it.objectType === 'environmentChannel'
                  )
                  let cameraRealList3 = res.data.filter(
                    (it) => it.objectType === 'camera'
                  )
                  if (environmentList3.length > 0) {
                    that.enableEnvironment = true
                    that.environmentId = environmentList3[0].objectLinkId
                    if (cameraRealList3.length > 0) {
                      that.realCameraId = cameraRealList3[0].objectLinkId
                      getLiveUrls(that.realCameraId, 'ws', true)
                        .then((result) => {
                          if (result.code == 200) {
                            let url =
                              result.data && result.data.url
                                ? result.data.url
                                : ''
                            that.currentUrlRealUrl = url
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              environmentList3[0].objectLinkId,
                              url
                            )
                          } else {
                            that.currentUrlRealUrl = ''
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              environmentList3[0].objectLinkId,
                              ''
                            )
                          }
                        })
                        .catch((error) => {
                          console.error('获取实时视频地址失败:', error)
                          that.$emit(
                            'setEnvironmentId',
                            true,
                            environmentList3[0].objectLinkId,
                            ''
                          )
                        })
                    } else {
                      that.$emit(
                        'setEnvironmentId',
                        true,
                        environmentList3[0].objectLinkId,
                        ''
                      )
                    }
                  } else {
                    that.enableEnvironment = false
                    that.environmentId = ''
                    that.$emit('setEnvironmentId', false, '', '')
                  }
                  that.savedJsonList.forEach((item) => {
                    // item.parameters = JSON.parse(item.parameters)
                    if (item.shapeType == 1) {
                      console.log('TEXT')
                      console.log(item.parameters.props)
                      console.log(item.parameters.style)
                      const text = new AILabel.Text(
                        // item.id,
                        item.objectLinkId ? item.objectLinkId : item.id,
                        {
                          text: item.name,
                          position: {
                            // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                            // y: JSON.parse(item.parameters)[0].y,
                            x: JSON.parse(item.parameters)[0].x,
                            y: JSON.parse(item.parameters)[0].y,
                          },
                          // offset: { x: 0, y: 0 },
                          offset: { x: (item.name.length - 1) * -5, y: 0 },
                        },
                        // item.parameters.props, // props
                        // { id: item.id, name: item.name, type: item.objectType, zIndex: 100, showName: true },
                        {
                          id: item.id,
                          extraId: item.objectLinkId ? item.objectLinkId : '',
                          name: item.name,
                          type: item.objectType,
                          zIndex: 100,
                          showName: true,
                        },
                        // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                        {
                          font: 'normal 12px Arial',
                          zIndex: 5,
                          opacity: 1,
                          fillStyle: that.configData.backgroundColor,
                          // fontColor: "#FFFFFF",
                          fontColor: that.configData.fontColor,
                          textAlign: 'left',
                          background: that.configData.setBackground,
                          strokeStyle: that.configData.backgroundColor,
                          textBaseline: 'bottom',
                        }
                      )
                      // that.textLayer.addText(text)
                      let type = item.objectType
                      let markerUrl = ''
                      if (type == 'door') {
                        markerUrl = './static/icon-door.png'
                      } else if (type == '3D') {
                        markerUrl = './static/model.png'
                      } else if (type == 'defence') {
                        markerUrl = './static/icon-defence.png'
                      } else if (type == 'map') {
                        markerUrl = './static/icon-map.png'
                      } else if (type == 'environmentChannel') {
                        markerUrl = './static/icon-environment.png'
                      } else if (type == 'camera') {
                        that.allCameraMarkers.push(item.objectLinkId)
                        var direction = JSON.parse(item.extendedInfo).direction
                        if (direction == 2) {
                          markerUrl = './static/ipc-4.png'
                        } else if (direction == 3) {
                          markerUrl = './static/ipc-1.png'
                        } else if (direction == 4) {
                          markerUrl = './static/ipc-6.png'
                        } else if (direction == 5) {
                          markerUrl = './static/ipc-2.png'
                        } else if (direction == 6) {
                          markerUrl = './static/ipc-7.png'
                        } else if (direction == 7) {
                          markerUrl = './static/ipc-3.png'
                        } else if (direction == 8) {
                          markerUrl = './static/ipc-5.png'
                        } else if (direction == 1) {
                          markerUrl = './static/ipc-0.png'
                        } else {
                          markerUrl = './static/ipc-0.png'
                        }
                      }
                      const markerFeature = new AILabel.Marker(
                        `feature-marker-${new Date().getTime()}`, // id
                        {
                          src: markerUrl,
                          position: JSON.parse(item.parameters)[0],
                        },
                        // item.parameters.props, // props
                        {
                          id: item.id,
                          extraId: item.objectLinkId ? item.objectLinkId : '',
                          name: item.name,
                          type: item.objectType,
                          zIndex: 100,
                          showName: true,
                        },
                        item.parameters.style // style
                      )
                      that.gMap.markerLayer.addMarker(markerFeature)

                      // 4月6日新增
                      // 1月9日注释 拖拽
                      // markerFeature.enableDragging()
                      // markerFeature.events.on("dragging", () => {
                      //   // 移动中删除 文本 和 选中rect
                      //   this.targetFeature && this.featureLayer.removeFeatureById("target-rect")
                      //   deleteText(textLayer, props)
                      // })
                      // markerFeature.events.on("dragEnd", ({ toUpdatePosition }) => {
                      //   // 移动结束后更新 文本和 marker位置
                      //   markerFeature.props.showName &&
                      //     addFeature({
                      //       gMap,
                      //       textLayer,
                      //       data: { x: toUpdatePosition.x, y: toUpdatePosition.y },
                      //       type: "TEXT",
                      //       // props,
                      //       props: item.parameters.props,
                      //     })
                      //   markerFeature.updatePosition({
                      //     x: toUpdatePosition.x,
                      //     y: toUpdatePosition.y,
                      //   })
                      //   this.targetFeature = addTargetRect(
                      //     gMap,
                      //     this.featureLayer,
                      //     textLayer,
                      //     markerFeature
                      //   )
                      // })
                      markerFeature.events.on('rightClick', (option) => {
                        // this.cameraInfo = option
                        // this.menuVisible = true
                        // this.rightMenuStyle = {
                        //   top: option.markerInfo.position.y + 100 + "px",
                        //   left: option.markerInfo.position.x + "px",
                        // }
                        // this.rightMenuStyle = {
                        //   top: 0 + "px",
                        //   left: 0 + "px",
                        // }
                        // console.log(this.rightMenuStyle)
                      })
                      var clicked = false
                      var clickTimeout
                      markerFeature.events.on('click', (option) => {
                        // alert(888)
                        var c = document.getElementById('imgDom')
                        var cxt = c.getContext('2d')
                        cxt.clearRect(0, 0, c.width, c.height)
                        console.log(option)
                        console.log(option.props.type)
                        that.targetFeature &&
                          that.featureLayer.removeFeatureById('target-rect')
                        // 添加矩形选中框
                        // this.targetFeature = addTargetRect(
                        //   this.gMap,
                        //   this.featureLayer,
                        //   this.textLayer,
                        //   markerFeature
                        // )
                        if (!clicked) {
                          clicked = true
                          clickTimeout = setTimeout(function () {
                            clicked = false
                          }, 300) // 设置双击间隔时间，这里设置为300毫秒
                        } else {
                          clearTimeout(clickTimeout)
                          clicked = false
                          // onDoubleClick() // 触发双击事件
                          if (option.props.type == 'camera') {
                            // that.cameraObj = option.props
                            // that.cameraVisible = true
                            // that.$refs['videoMonitor'].dialogVisible = true
                            // that.$refs['videoMonitor'].init(option.props.id)
                            let objLinkId = that.savedJsonList.filter(
                              (it) => it.id == option.props.id
                            )
                            console.log(objLinkId)
                            var actionOne = {
                              type: 103,
                              isRealVideo: 1,
                              startPosition: 'centerScreen',
                              cameraIds: that.allCameraMarkers,
                              data: [objLinkId[0].objectLinkId],
                            }
                            that.toOpenCamera(JSON.stringify(actionOne))
                            // alert(111);
                            // getDeviceInfo(option.props.id).then((res) => {
                            //   that.cameraObj = res.data ? res.data : {}
                            //   let row = res.data ? res.data : {}
                            //   console.log(row)
                            //   that.getUrl(row)
                            // })
                          } else if (option.props.type == 'door') {
                            that.doorVisible = true
                          } else if (option.props.type == 'defence') {
                            that.defenceVisible = true
                          } else if (option.props.type == 'map') {
                            console.log(option.props.id)
                            that.goToMap(option.props.id)
                            // that.$router.push({
                            //   path: "/comprehensive-control/mapIndex",
                            //   query: {
                            //     id: option.props.id,
                            //     isJump: that.$route.query.isJump
                            //   },
                            // })
                          } else if (option.props.type == '3D') {
                            that.initCesium(option.props.extraId)
                          } else if (
                            option.props.type == 'environmentChannel'
                          ) {
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              option.props.extraId,
                              that.currentUrlRealUrl
                            )
                          }
                        }
                        // this.cameraObj = option.props
                        // this.cameraVisible = true
                        // // alert(111);
                        // getDeviceInfo(option.props.id).then((res) => {
                        //   this.cameraObj = res.data ? res.data : {}
                        //   let row = res.data ? res.data : {}
                        //   console.log(row)
                        //   that.getUrl(row)
                        // })
                        // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);//4月6日修改
                        // this.keyDown(this.gMap, markerFeature, this.textLayer, option.props);
                        // console.log(option);
                        // this.cameraInfo = option;
                        // this.targetFeature && this.featureLayer.removeFeatureById("target-rect");
                        // // 添加矩形选中框
                        // this.targetFeature = addTargetRect(
                        //   this.gMap,
                        //   this.featureLayer,
                        //   this.textLayer,
                        //   markerFeature
                        // );
                      })
                      markerFeature.events.on('mouseOver', (option) => {
                        // if (option.markerInfo.src !== this.markerHoverUrl) {
                        //   gMap.markerLayer.removeMarkerById(option.id)
                        //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerHoverUrl, props });
                        // }
                      })
                      markerFeature.events.on('mouseOut', (option) => {
                        // if (option.markerInfo.src !== this.markerUrl) {
                        //   gMap.markerLayer.removeMarkerById(option.id)
                        //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerUrl, props });
                        // }
                      })
                      console.log(666)
                      console.log(item.parameters.props)
                      // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);
                      // 4 月6日完成
                    } else if (item.shapeType == 3) {
                      var extendInfo = item.extendedInfo
                      const polygonFeature = new AILabel.Feature.Polygon(
                        item.id,
                        { points: JSON.parse(item.parameters) }, // shape
                        // item.parameters.props, // props
                        // item.parameters.style || {
                        //   strokeStyle: "#00f",
                        //   lineWidth: 2,
                        //   fill: true,
                        //   stroke: true,
                        // } // style
                        // { props: null },
                        extendInfo
                          ? JSON.parse(extendInfo)
                          : JSON.parse({
                              type: 'POLYGON',
                              zIndex: 100,
                              showName: false,
                            }), // props
                        {
                          // strokeStyle: "rgba(0, 0, 0, 0)",
                          // strokeStyle: "#f00",
                          // strokeStyle: "rgba(0, 0, 0, 0)",
                          strokeStyle:
                            item.objectType == 'group'
                              ? '#f00'
                              : 'rgba(0, 0, 0, 0)',
                          lineWidth: 2,
                          fill: true,
                          stroke: true,
                        }
                      )
                      let featureId = item.id
                      that.linkedList[featureId] = {
                        type: item.objectType,
                        id: item.objectLinkId,
                        name: item.name,
                      }
                      that.featureLayer.addFeature(polygonFeature)
                      console.log(item, '多边形的数据1', item.name)
                      if (item.objectType == 'map') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                                x: that.getCenterPosition(
                                  JSON.parse(item.parameters)
                                ).x,
                                y:
                                  that.getCenterPosition(
                                    JSON.parse(item.parameters)
                                  ).y -
                                  that.getMaxDistance(
                                    JSON.parse(item.parameters)
                                  ),
                              },
                              offset: {
                                x: (item.name.length - 1) * -4,
                                y: -10,
                              },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              // fillStyle: "#0A72D1",
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale1', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    4 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            },
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      } else if (item.objectType == 'group') {
                        const text = new AILabel.Text(
                          'title' + item.id,
                          {
                            text: item.name || '视频分组',
                            position: {
                              // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                              x: that.getCenterPosition(
                                JSON.parse(item.parameters)
                              ).x,
                              y: that.getCenterPosition(
                                JSON.parse(item.parameters)
                              ).y,
                            },
                            offset: {
                              x:
                                ((item.name.length == 0
                                  ? 4
                                  : item.name.length) -
                                  1) *
                                -4,
                              y: -10,
                            },
                          },
                          // item.parameters.props, // props
                          {
                            id: item.objectLinkId,
                            name: item.name || '视频分组',
                            type: 'title',
                            zIndex: 100,
                            showName: true,
                          },
                          // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                          {
                            font: 'normal 12px Arial',
                            zIndex: 5,
                            opacity: 1,
                            fillStyle: that.configData.backgroundColor,
                            // fillStyle: "#0A72D1",
                            fontColor: that.configData.fontColor,
                            textAlign: 'left',
                            background: that.configData.setBackground,
                            // strokeStyle: that.configData.backgroundColor,
                            textBaseline: 'bottom',
                          }
                        )
                        that.textLayer.addText(text)
                      } else if (item.objectType == '3D') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                                x: that.getCenterPosition(
                                  JSON.parse(item.parameters)
                                ).x,
                                y:
                                  that.getCenterPosition(
                                    JSON.parse(item.parameters)
                                  ).y -
                                  that.getMaxDistance(
                                    JSON.parse(item.parameters)
                                  ),
                              },
                              offset: {
                                x: (item.name.length - 1) * -4,
                                y: -10,
                              },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              // fillStyle: "#0A72D1",
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale1', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    4 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            },
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      }
                    } else if (item.shapeType == 5) {
                      var extendInfo = item.extendedInfo
                      const circleFeature = new AILabel.Feature.Circle(
                        item.id, // id
                        {
                          cx: JSON.parse(item.parameters).cx,
                          cy: JSON.parse(item.parameters).cy,
                          r: JSON.parse(item.parameters).r,
                        }, // shape
                        // { props: null }, // props
                        extendInfo
                          ? JSON.parse(extendInfo)
                          : JSON.parse({
                              type: 'CIRCLR',
                              zIndex: 100,
                              showName: false,
                            }),
                        {
                          strokeStyle:
                            item.objectType == 'group'
                              ? '#f00'
                              : 'rgba(0, 0, 0, 0)',
                          // globalAlpha: 1,
                          lineWidth: 2,
                        } // style
                      )
                      let featureId = item.id
                      that.linkedList[featureId] = {
                        type: item.objectType,
                        id: item.objectLinkId,
                        name: item.name,
                      }
                      that.featureLayer.addFeature(circleFeature)
                      console.log(item, '圆形的数据1', item.name)
                      if (item.objectType == 'map') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                                x: JSON.parse(item.parameters).cx,
                                y:
                                  JSON.parse(item.parameters).cy -
                                  JSON.parse(item.parameters).r,
                              },
                              offset: { x: (item.name.length - 1) * -2, y: 0 },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              // fillStyle: "#0A72D1",
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              // strokeStyle: "#00FF00",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale2', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                {
                                  x:
                                    JSON.parse(item.parameters).cx -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    4.5 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            }, // shape
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      } else if (item.objectType == 'group') {
                        const text = new AILabel.Text(
                          'title' + item.id,
                          {
                            text: item.name || '视频分组',
                            position: {
                              // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                              x: JSON.parse(item.parameters).cx,
                              y:
                                JSON.parse(item.parameters).cy -
                                JSON.parse(item.parameters).r,
                            },
                            offset: {
                              x:
                                ((item.name.length == 0
                                  ? 4
                                  : item.name.length) -
                                  1 -
                                  1) *
                                -2,
                              y: -10,
                            },
                          },
                          // item.parameters.props, // props
                          {
                            id: item.objectLinkId,
                            name: item.name || '视频分组',
                            type: 'title',
                            zIndex: 100,
                            showName: true,
                          },
                          // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                          {
                            font: 'normal 12px Arial',
                            zIndex: 5,
                            opacity: 1,
                            // fillStyle: "#0A72D1",
                            fillStyle: that.configData.backgroundColor,
                            fontColor: that.configData.fontColor,
                            textAlign: 'left',
                            background: that.configData.setBackground,
                            // strokeStyle: "#0A72D1",
                            // strokeStyle: "#00FF00",
                            textBaseline: 'bottom',
                          }
                        )
                        that.textLayer.addText(text)
                      }
                    }
                  })
                  that.animationId = thirdId
                  that.updateAnimation(thirdId)
                  // 在图层上添加事件 放到标签及图形回显之后
                  setTimeout(function () {
                    that.addEvent(that.gMap, that.featureLayer, that.textLayer)
                  }, 30)
                  if (positionInfo) {
                    // sessionStorage.removeItem("positionInfo")
                    setTimeout(function () {
                      that.gMap.centerAndZoom({
                        center: { x: positionInfo.x, y: positionInfo.y },
                        zoom: that.currentZoom,
                      })
                      let cameraId = sessionStorage.getItem('cameraId')
                      if (cameraId) {
                        // const allTexts = that.textLayer.getAllTexts()
                        const allTexts = that.gMap.markerLayer.getAllMarkers()
                        for (let i = 0; i < allTexts.length; i++) {
                          if (cameraId == allTexts[i].props.extraId) {
                            that.targetFeature &&
                              that.featureLayer.removeFeatureById('target-rect')
                            that.targetFeature = addTargetRect(
                              that.gMap,
                              that.featureLayer,
                              that.textLayer,
                              {
                                props: {
                                  id: allTexts[i].props.extraId,
                                  showName: true,
                                  name: allTexts[i].props.name,
                                },
                                markerInfo: {
                                  position: {
                                    x: positionInfo.x,
                                    y: positionInfo.y,
                                  },
                                },
                              }
                            )
                            sessionStorage.removeItem('cameraId')
                            break
                          }
                        }
                      }
                      sessionStorage.removeItem('positionInfo')
                    }, 80)
                  }
                  const coordinates = sessionStorage.getItem('positionInfo')
                  if (coordinates) {
                    setTimeout(function () {
                      that.gMap.centerAndZoom({
                        center: JSON.parse(coordinates),
                        zoom: that.currentZoom,
                      })
                      // sessionStorage.removeItem("positionInfo")
                      let cameraId = sessionStorage.getItem('cameraId')
                      if (cameraId) {
                        // const allTexts = that.textLayer.getAllTexts()
                        const allTexts = that.gMap.markerLayer.getAllMarkers()
                        for (let i = 0; i < allTexts.length; i++) {
                          if (cameraId == allTexts[i].props.extraId) {
                            that.targetFeature &&
                              that.featureLayer.removeFeatureById('target-rect')
                            that.targetFeature = addTargetRect(
                              that.gMap,
                              that.featureLayer,
                              that.textLayer,
                              {
                                props: {
                                  id: allTexts[i].props.extraId,
                                  showName: true,
                                  name: allTexts[i].props.name,
                                },
                                markerInfo: {
                                  // position: JSON.parse(coordinates)
                                  position: {
                                    x: JSON.parse(coordinates).x,
                                    y: JSON.parse(coordinates).y,
                                  },
                                },
                              }
                            )
                            sessionStorage.removeItem('cameraId')
                            break
                          }
                        }
                      }
                      sessionStorage.removeItem('positionInfo')
                    }, 80)
                  }
                  getMapTree().then((mapTree) => {
                    console.log('地图树1', mapTree)
                    var findResult = that.findParentIdById(
                      thirdId,
                      mapTree.data
                    )
                    if (findResult) {
                      var parentResult = that.findParentIdById(
                        findResult,
                        mapTree.data
                      )
                      console.log('parentResult1', parentResult)
                      if (parentResult == '0') {
                        that.levelList = []
                      } else {
                        that.levelList = []
                        that.levelList.push(parentResult)
                      }
                    } else {
                      that.levelList = []
                    }
                  })
                  // 查询regionId
                  getLineMap(thirdId).then((res1) => {
                    console.log(res1.data, 'region数据2')
                    getLineTree(false, false).then((res2) => {
                      that.regionData = res2.data
                      that.addLevelToTree(that.regionData, 1)
                      console.log(that.regionData, '层级数据')
                      let findData = that.findItemById(
                        that.regionData,
                        res1.data.regionId
                      )
                      console.log(findData, 'findData')
                      const AncestorData = that.findAncestorWithLevel3(
                        findData.id
                      )
                      console.log(AncestorData, '第三层的父级')
                      if (findData.level == 1) {
                        // that.showStationList = false
                        // that.stationList = []
                        // that.stationIndex = -1
                        that.showToggleFloor = false
                        that.showToggleIndex = -1
                        that.showToggleName = ''
                        if (res1.data.showLine == false) {
                          that.showStationList = false
                          that.stationList = []
                          that.stationIndex = -1
                        } else {
                          getPeerRegion(findData.id).then((res3) => {
                            console.log(res3.data, '站点构造数据2')
                            if (res3.data.length > 0) {
                              that.showStationList = true
                              that.stationList = res3.data
                              that.stationIndex = that.stationList.findIndex(
                                (it) => it.id == findData.id
                              )
                            } else {
                              that.showStationList = false
                              that.stationList = []
                              that.stationIndex = -1
                            }
                          })
                        }
                      } else if (findData.level <= 3) {
                        getPeerRegion(res1.data.regionId).then((res3) => {
                          console.log(res3.data, '站点构造数据22')
                          if (res3.data.length > 0) {
                            that.stationList = res3.data
                            that.stationIndex = that.stationList.findIndex(
                              (it) => it.id == findData.id
                            )
                            let data = {
                              regionId: res1.data.regionId,
                              current: 1,
                              size: -1,
                              name: '',
                              flag: false,
                              type: '',
                            }
                            getMapByPage(data).then((res) => {
                              let tempList = res.data.records.filter(
                                (it) => it.deleteFlag == '0'
                              )
                              function customSort(a, b) {
                                if (a.type === b.type) {
                                  return a.sort - b.sort
                                } else {
                                  return a.type - b.type
                                }
                                // return a.sort - b.sort
                              }
                              let resultList = tempList.sort(customSort)
                              console.log(resultList, '哈哈哈3')
                              var toggleAllFloorList = resultList
                              sessionStorage.setItem(
                                'toggleAllFloorList',
                                JSON.stringify(toggleAllFloorList)
                              )
                              that.showToggleFloor = true
                              if (Array.isArray(listInfo)) {
                                that.showToggleName = toggleAllFloorList.find(
                                  (item) => item.id === listInfo[0].objectLinkId
                                ).name
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) =>
                                      item.id === listInfo[0].objectLinkId
                                  )
                              } else if (typeof listInfo === 'object') {
                                if (listInfo.objectLinkId) {
                                  that.showToggleName = toggleAllFloorList.find(
                                    (item) => item.id === listInfo.objectLinkId
                                  ).name
                                  that.showToggleIndex =
                                    toggleAllFloorList.findIndex(
                                      (item) =>
                                        item.id === listInfo.objectLinkId
                                    )
                                } else {
                                  that.showToggleName = toggleAllFloorList.find(
                                    (item) => item.id === listInfo.id
                                  ).name
                                  that.showToggleIndex =
                                    toggleAllFloorList.findIndex(
                                      (item) => item.id === listInfo.id
                                    )
                                }
                              }
                              // that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
                              // that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
                              that.toggleAllFloorList = toggleAllFloorList //修复bug
                              if (res1.data.showLine == false) {
                                that.showStationList = false
                                that.stationList = []
                                that.stationIndex = -1
                              } else {
                                that.showStationList = true
                              }
                            })
                          } else {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                            // if (res1.data.showLine == false) {
                            //   that.showStationList = false
                            //   that.stationList = []
                            //   that.stationIndex = -1
                            // }
                          }
                        })
                      } else {
                        getPeerRegion(AncestorData.id).then((res3) => {
                          console.log(res3.data, '站点构造数据2222')
                          if (res3.data.length > 0) {
                            that.stationList = res3.data
                            that.stationIndex = that.stationList.findIndex(
                              (it) => it.id == AncestorData.id
                            )
                            let data = {
                              regionId: res1.data.regionId,
                              current: 1,
                              size: -1,
                              name: '',
                              flag: true,
                              type: '',
                            }
                            getMapByPage(data).then((res) => {
                              let tempList = res.data.records.filter(
                                (it) => it.deleteFlag == '0'
                              )
                              function customSort(a, b) {
                                if (a.type === b.type) {
                                  return a.sort - b.sort
                                } else {
                                  return a.type - b.type
                                }
                                // return a.sort - b.sort
                              }
                              let resultList = tempList.sort(customSort)
                              console.log(resultList, '哈哈哈1')
                              var toggleAllFloorList = resultList
                              sessionStorage.setItem(
                                'toggleAllFloorList',
                                JSON.stringify(toggleAllFloorList)
                              )
                              that.showToggleFloor = true
                              if (Array.isArray(listInfo)) {
                                that.showToggleName = toggleAllFloorList.find(
                                  (item) => item.id === listInfo[0].objectLinkId
                                ).name
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) =>
                                      item.id === listInfo[0].objectLinkId
                                  )
                              } else if (typeof listInfo === 'object') {
                                if (listInfo.objectLinkId) {
                                  that.showToggleName = toggleAllFloorList.find(
                                    (item) => item.id === listInfo.objectLinkId
                                  ).name
                                  that.showToggleIndex =
                                    toggleAllFloorList.findIndex(
                                      (item) =>
                                        item.id === listInfo.objectLinkId
                                    )
                                } else {
                                  that.showToggleName = toggleAllFloorList.find(
                                    (item) => item.id === listInfo.id
                                  ).name
                                  that.showToggleIndex =
                                    toggleAllFloorList.findIndex(
                                      (item) => item.id === listInfo.id
                                    )
                                }
                              }
                              // that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
                              // that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
                              that.toggleAllFloorList = toggleAllFloorList //修复bug
                              if (res1.data.showLine == false) {
                                that.showStationList = false
                                that.stationList = []
                                that.stationIndex = -1
                              } else {
                                that.showStationList = true
                              }
                            })
                          } else {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                            // if (res1.data.showLine == false) {
                            //   that.showStationList = false
                            //   that.stationList = []
                            //   that.stationIndex = -1
                            // }
                          }
                        })
                        // 结束
                      }
                      // if (res1.data.showLine == false) {
                      //   alert(777)
                      //   that.showStationList = false
                      //   that.stationList = []
                      //   that.stationIndex = -1
                      // }
                    })
                  })
                  //查询结束
                  if (sessionStorage.getItem('hightlightInfo')) {
                    let hightlightInfo = JSON.parse(
                      sessionStorage.getItem('hightlightInfo')
                    )
                    // sessionStorage.removeItem('hightlightInfo')
                    if (that.showVR) {
                      that.highlightCameraSprite(
                        hightlightInfo.labels[0].objectLinkId
                      )
                    } else {
                      that.targetFeature &&
                        that.featureLayer.removeFeatureById('target-rect')
                      that.targetFeature = null
                      that.targetFeature = addTargetRect(
                        that.gMap,
                        that.featureLayer,
                        that.textLayer,
                        {
                          props: {
                            id: hightlightInfo.labels[0].objectLinkId,
                            showName: false,
                            name: hightlightInfo.labels[0].name,
                          },
                          markerInfo: {
                            position: {
                              x: JSON.parse(
                                hightlightInfo.labels[0].parameters
                              )[0].x,
                              y: JSON.parse(
                                hightlightInfo.labels[0].parameters
                              )[0].y,
                            },
                          },
                        }
                      )
                    }
                  }
                })
                .catch((err) => {
                  // 错误处理
                  console.error('错误:', err)
                })
                .finally(() => {
                  // 无论成功或失败都会执行
                  // if (sessionStorage.getItem('hightlightInfo')) {
                  //   let hightlightInfo = JSON.parse(
                  //     sessionStorage.getItem('hightlightInfo')
                  //   )
                  //   sessionStorage.removeItem('hightlightInfo')
                  //   if (that.showVR) {
                  //     that.highlightCameraSprite(
                  //       hightlightInfo.labels[0].objectLinkId
                  //     )
                  //   } else {
                  //     that.targetFeature &&
                  //       that.featureLayer.removeFeatureById('target-rect')
                  //     that.targetFeature = null
                  //     that.targetFeature = addTargetRect(
                  //       that.gMap,
                  //       that.featureLayer,
                  //       that.textLayer,
                  //       {
                  //         props: {
                  //           id: hightlightInfo.labels[0].objectLinkId,
                  //           showName: false,
                  //           name: hightlightInfo.labels[0].name,
                  //         },
                  //         markerInfo: {
                  //           position: {
                  //             x: JSON.parse(
                  //               hightlightInfo.labels[0].parameters
                  //             )[0].x,
                  //             y: JSON.parse(
                  //               hightlightInfo.labels[0].parameters
                  //             )[0].y,
                  //           },
                  //         },
                  //       }
                  //     )
                  //   }
                  // }
                })
            } else {
              getMapLabelList(mapId)
                .then((res) => {
                  console.log('图片src', img.src)
                  console.log('所有标签333333', res.data)
                  that.allCameraMarkers = []
                  console.log('that.scaleFactor', that.scaleFactor)
                  console.log('that.currentScale', that.currentScale)
                  console.log('that.currentZoom', that.currentZoom)
                  that.savedJsonList = res.data
                  let environmentList1 = res.data.filter(
                    (it) => it.objectType === 'environmentChannel'
                  )
                  let cameraRealList1 = res.data.filter(
                    (it) => it.objectType === 'camera'
                  )
                  if (environmentList1.length > 0) {
                    that.enableEnvironment = true
                    that.environmentId = environmentList1[0].objectLinkId
                    if (cameraRealList1.length > 0) {
                      that.realCameraId = cameraRealList1[0].objectLinkId
                      getLiveUrls(that.realCameraId, 'ws', true)
                        .then((result) => {
                          if (result.code == 200) {
                            let url =
                              result.data && result.data.url
                                ? result.data.url
                                : ''
                            that.currentUrlRealUrl = url
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              environmentList1[0].objectLinkId,
                              url
                            )
                          } else {
                            that.currentUrlRealUrl = ''
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              environmentList1[0].objectLinkId,
                              ''
                            )
                          }
                        })
                        .catch((error) => {
                          console.error('获取实时视频地址失败:', error)
                          that.$emit(
                            'setEnvironmentId',
                            true,
                            environmentList1[0].objectLinkId,
                            ''
                          )
                        })
                    } else {
                      that.$emit(
                        'setEnvironmentId',
                        true,
                        environmentList1[0].objectLinkId,
                        ''
                      )
                    }
                  } else {
                    that.enableEnvironment = false
                    that.environmentId = ''
                    that.$emit('setEnvironmentId', false, '', '')
                  }
                  that.savedJsonList.forEach((item) => {
                    // item.parameters = JSON.parse(item.parameters)
                    if (item.shapeType == 1) {
                      console.log('TEXT')
                      console.log(item.parameters.props)
                      console.log(item.parameters.style)
                      const text = new AILabel.Text(
                        // item.id,
                        item.objectLinkId ? item.objectLinkId : item.id,
                        {
                          text: item.name,
                          position: {
                            // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                            // y: JSON.parse(item.parameters)[0].y,
                            x: JSON.parse(item.parameters)[0].x,
                            y: JSON.parse(item.parameters)[0].y,
                          },
                          // offset: { x: 0, y: 0 },
                          offset: { x: (item.name.length - 1) * -5, y: 0 },
                        },
                        // item.parameters.props, // props
                        // { id: item.id, name: item.name, type: item.objectType, zIndex: 100, showName: true },
                        {
                          id: item.id,
                          extraId: item.objectLinkId ? item.objectLinkId : '',
                          name: item.name,
                          type: item.objectType,
                          zIndex: 100,
                          showName: true,
                        },
                        // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                        {
                          font: 'normal 12px Arial',
                          zIndex: 5,
                          opacity: 1,
                          fillStyle: that.configData.backgroundColor,
                          // fontColor: "#FFFFFF",
                          fontColor: that.configData.fontColor,
                          textAlign: 'left',
                          background: that.configData.setBackground,
                          strokeStyle: that.configData.backgroundColor,
                          textBaseline: 'bottom',
                        }
                      )
                      // that.textLayer.addText(text)
                      let type = item.objectType
                      let markerUrl = ''
                      if (type == 'door') {
                        markerUrl = './static/icon-door.png'
                      } else if (type == '3D') {
                        markerUrl = './static/model.png'
                      } else if (type == 'defence') {
                        markerUrl = './static/icon-defence.png'
                      } else if (type == 'map') {
                        markerUrl = './static/icon-map.png'
                      } else if (type == 'environmentChannel') {
                        markerUrl = './static/icon-environment.png'
                      } else if (type == 'camera') {
                        that.allCameraMarkers.push(item.objectLinkId)
                        var direction = JSON.parse(item.extendedInfo).direction
                        if (direction == 2) {
                          markerUrl = './static/ipc-4.png'
                        } else if (direction == 3) {
                          markerUrl = './static/ipc-1.png'
                        } else if (direction == 4) {
                          markerUrl = './static/ipc-6.png'
                        } else if (direction == 5) {
                          markerUrl = './static/ipc-2.png'
                        } else if (direction == 6) {
                          markerUrl = './static/ipc-7.png'
                        } else if (direction == 7) {
                          markerUrl = './static/ipc-3.png'
                        } else if (direction == 8) {
                          markerUrl = './static/ipc-5.png'
                        } else if (direction == 1) {
                          markerUrl = './static/ipc-0.png'
                        } else {
                          markerUrl = './static/ipc-0.png'
                        }
                      }
                      const markerFeature = new AILabel.Marker(
                        `feature-marker-${new Date().getTime()}`, // id
                        {
                          src: markerUrl,
                          position: JSON.parse(item.parameters)[0],
                        },
                        // item.parameters.props, // props
                        {
                          id: item.id,
                          extraId: item.objectLinkId ? item.objectLinkId : '',
                          name: item.name,
                          type: item.objectType,
                          zIndex: 100,
                          showName: true,
                        },
                        item.parameters.style // style
                      )
                      that.gMap.markerLayer.addMarker(markerFeature)

                      // 4月6日新增
                      // 1月9日注释 拖拽
                      // markerFeature.enableDragging()
                      // markerFeature.events.on("dragging", () => {
                      //   // 移动中删除 文本 和 选中rect
                      //   this.targetFeature && this.featureLayer.removeFeatureById("target-rect")
                      //   deleteText(textLayer, props)
                      // })
                      // markerFeature.events.on("dragEnd", ({ toUpdatePosition }) => {
                      //   // 移动结束后更新 文本和 marker位置
                      //   markerFeature.props.showName &&
                      //     addFeature({
                      //       gMap,
                      //       textLayer,
                      //       data: { x: toUpdatePosition.x, y: toUpdatePosition.y },
                      //       type: "TEXT",
                      //       // props,
                      //       props: item.parameters.props,
                      //     })
                      //   markerFeature.updatePosition({
                      //     x: toUpdatePosition.x,
                      //     y: toUpdatePosition.y,
                      //   })
                      //   this.targetFeature = addTargetRect(
                      //     gMap,
                      //     this.featureLayer,
                      //     textLayer,
                      //     markerFeature
                      //   )
                      // })
                      markerFeature.events.on('rightClick', (option) => {
                        // this.cameraInfo = option
                        // this.menuVisible = true
                        // this.rightMenuStyle = {
                        //   top: option.markerInfo.position.y + 100 + "px",
                        //   left: option.markerInfo.position.x + "px",
                        // }
                        // this.rightMenuStyle = {
                        //   top: 0 + "px",
                        //   left: 0 + "px",
                        // }
                        // console.log(this.rightMenuStyle)
                      })
                      var clicked = false
                      var clickTimeout
                      markerFeature.events.on('click', (option) => {
                        // alert(999)
                        var c = document.getElementById('imgDom')
                        var cxt = c.getContext('2d')
                        cxt.clearRect(0, 0, c.width, c.height)
                        console.log(option)
                        // const allTexts = that.textLayer.getAllTexts()
                        // console.log(allTexts)
                        console.log(option.props.type)
                        that.targetFeature &&
                          that.featureLayer.removeFeatureById('target-rect')
                        // 添加矩形选中框
                        // this.targetFeature = addTargetRect(
                        //   this.gMap,
                        //   this.featureLayer,
                        //   this.textLayer,
                        //   markerFeature
                        // )
                        if (!clicked) {
                          clicked = true
                          clickTimeout = setTimeout(function () {
                            clicked = false
                          }, 300) // 设置双击间隔时间，这里设置为300毫秒
                        } else {
                          clearTimeout(clickTimeout)
                          clicked = false
                          // onDoubleClick() // 触发双击事件
                          if (option.props.type == 'camera') {
                            // that.cameraObj = option.props
                            // that.cameraVisible = true
                            // that.$refs['videoMonitor'].dialogVisible = true
                            // that.$refs['videoMonitor'].init(option.props.id)
                            let objLinkId = that.savedJsonList.filter(
                              (it) => it.id == option.props.id
                            )
                            var actionOne = {
                              type: 103,
                              isRealVideo: 1,
                              startPosition: 'centerScreen',
                              cameraIds: that.allCameraMarkers,
                              data: [objLinkId[0].objectLinkId],
                            }
                            console.log(objLinkId)
                            // alert(2)
                            console.log(that.$parent.$parent.$parent.$parent)
                            that.toOpenCamera(JSON.stringify(actionOne))
                            // alert(111);
                            // getDeviceInfo(option.props.id).then((res) => {
                            //   that.cameraObj = res.data ? res.data : {}
                            //   let row = res.data ? res.data : {}
                            //   console.log(row)
                            //   that.getUrl(row)
                            // })
                          } else if (option.props.type == 'door') {
                            that.doorVisible = true
                          } else if (option.props.type == 'defence') {
                            that.defenceVisible = true
                          } else if (option.props.type == 'map') {
                            console.log(option.props.id)
                            that.goToMap(option.props.id)
                            // that.$router.push({
                            //   path: "/comprehensive-control/mapIndex",
                            //   query: {
                            //     id: option.props.id,
                            //     isJump: that.$route.query.isJump
                            //   },
                            // })
                          } else if (option.props.type == '3D') {
                            that.initCesium(option.props.extraId)
                          } else if (
                            option.props.type == 'environmentChannel'
                          ) {
                            that.$emit(
                              'setEnvironmentId',
                              true,
                              option.props.extraId,
                              that.currentUrlRealUrl
                            )
                          }
                        }
                        // this.cameraObj = option.props
                        // this.cameraVisible = true
                        // // alert(111);
                        // getDeviceInfo(option.props.id).then((res) => {
                        //   this.cameraObj = res.data ? res.data : {}
                        //   let row = res.data ? res.data : {}
                        //   console.log(row)
                        //   that.getUrl(row)
                        // })
                        // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);//4月6日修改
                        // this.keyDown(this.gMap, markerFeature, this.textLayer, option.props);
                        // console.log(option);
                        // this.cameraInfo = option;
                        // this.targetFeature && this.featureLayer.removeFeatureById("target-rect");
                        // // 添加矩形选中框
                        // this.targetFeature = addTargetRect(
                        //   this.gMap,
                        //   this.featureLayer,
                        //   this.textLayer,
                        //   markerFeature
                        // );
                      })
                      markerFeature.events.on('mouseOver', (option) => {
                        // if (option.markerInfo.src !== this.markerHoverUrl) {
                        //   gMap.markerLayer.removeMarkerById(option.id)
                        //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerHoverUrl, props });
                        // }
                      })
                      markerFeature.events.on('mouseOut', (option) => {
                        // if (option.markerInfo.src !== this.markerUrl) {
                        //   gMap.markerLayer.removeMarkerById(option.id)
                        //   this.createMarker({ gMap, textLayer, data: option.markerInfo.position, type: 'MARKER', markerUrl: this.markerUrl, props });
                        // }
                      })
                      console.log(666)
                      console.log(item.parameters.props)
                      // this.keyDown(this.gMap, markerFeature, this.textLayer, this.props);
                      // 4 月6日完成
                    } else if (item.shapeType == 3) {
                      var extendInfo = item.extendedInfo
                      const polygonFeature = new AILabel.Feature.Polygon(
                        item.id,
                        { points: JSON.parse(item.parameters) }, // shape
                        // item.parameters.props, // props
                        // item.parameters.style || {
                        //   strokeStyle: "#00f",
                        //   lineWidth: 2,
                        //   fill: true,
                        //   stroke: true,
                        // } // style
                        // { props: null },
                        extendInfo
                          ? JSON.parse(extendInfo)
                          : JSON.parse({
                              type: 'POLYGON',
                              zIndex: 100,
                              showName: false,
                            }), // props
                        {
                          // strokeStyle: "rgba(0, 0, 0, 0)",
                          // strokeStyle: "#f00",
                          strokeStyle:
                            item.objectType == 'group'
                              ? '#f00'
                              : 'rgba(0, 0, 0, 0)',
                          lineWidth: 2,
                          lineWidth: 2,
                          fill: true,
                          stroke: true,
                        }
                      )
                      let featureId = item.id
                      that.linkedList[featureId] = {
                        type: item.objectType,
                        id: item.objectLinkId,
                        name: item.name,
                      }
                      that.featureLayer.addFeature(polygonFeature)
                      if (item.objectType == 'map') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                x: that.getCenterPosition(
                                  JSON.parse(item.parameters)
                                ).x,
                                y:
                                  that.getCenterPosition(
                                    JSON.parse(item.parameters)
                                  ).y -
                                  that.getMaxDistance(
                                    JSON.parse(item.parameters)
                                  ),
                              },
                              offset: {
                                x: (item.name.length - 1) * -4,
                                y: -10,
                              },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              // fillStyle: "#0A72D1",
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              // strokeStyle: "#00FF00",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale3', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    4 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            }, // shape
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      } else if (item.objectType == 'group') {
                        const text = new AILabel.Text(
                          'title' + item.id,
                          {
                            text: item.name || '视频分组',
                            position: {
                              x: that.getCenterPosition(
                                JSON.parse(item.parameters)
                              ).x,
                              y: that.getCenterPosition(
                                JSON.parse(item.parameters)
                              ).y,
                            },
                            offset: {
                              x:
                                ((item.name.length == 0
                                  ? 4
                                  : item.name.length) -
                                  1) *
                                -4,
                              y: -10,
                            },
                          },
                          // item.parameters.props, // props
                          {
                            id: item.objectLinkId,
                            name: item.name || '视频分组',
                            type: 'title',
                            zIndex: 100,
                            showName: true,
                          },
                          // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                          {
                            font: 'normal 12px Arial',
                            zIndex: 5,
                            opacity: 1,
                            // fillStyle: "#0A72D1",
                            fillStyle: that.configData.backgroundColor,
                            fontColor: that.configData.fontColor,
                            textAlign: 'left',
                            background: that.configData.setBackground,
                            // strokeStyle: "#0A72D1",
                            // strokeStyle: "#00FF00",
                            textBaseline: 'bottom',
                          }
                        )
                        that.textLayer.addText(text)
                        console.log('that.currentScale3', that.currentScale)
                        // const polygonFeature = new AILabel.Feature.Polygon(
                        //   "title" + item.id,
                        //   {
                        //     points: [
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x - (item.name.length * 0.7) * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) - 5 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x + (item.name.length > 2 ? (item.name.length * 1.45) : (item.name.length * 2.9)) * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) - 5 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x + (item.name.length > 2 ? (item.name.length * 1.45) : (item.name.length * 2.9)) * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 2 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 4 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 2 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 2.5 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 4.5 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 1 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 2 * (5.74 / that.scaleFactor) },
                        //       { x: that.getCenterPosition(JSON.parse(item.parameters)).x - (item.name.length * 0.7) * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 2 * (5.74 / that.scaleFactor) },
                        //     ]
                        //   },// shape
                        //   { type: "POLYGON", zIndex: 100, showName: false }, // props
                        //   {
                        //     // strokeStyle: "rgba(0, 0, 0, 0)",
                        //     fillStyle: "rgba(50, 180, 180, 0.3)",
                        //     strokeStyle: "#FFFFFF",
                        //     // strokeStyle: "rgba(0, 0, 0, 0)",
                        //     lineWidth: 2,
                        //     fill: true,
                        //     stroke: true,
                        //   }
                        // )
                        // that.featureLayer.addFeature(polygonFeature)
                      } else if (item.objectType == '3D') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                x: that.getCenterPosition(
                                  JSON.parse(item.parameters)
                                ).x,
                                y:
                                  that.getCenterPosition(
                                    JSON.parse(item.parameters)
                                  ).y -
                                  that.getMaxDistance(
                                    JSON.parse(item.parameters)
                                  ),
                              },
                              offset: {
                                x: (item.name.length - 1) * -4,
                                y: -10,
                              },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              // fillStyle: "#0A72D1",
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              // strokeStyle: "#00FF00",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale3', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    (item.name.length > 2
                                      ? item.name.length * 1.45
                                      : item.name.length * 2.9) *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    4 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).x -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    that.getCenterPosition(
                                      JSON.parse(item.parameters)
                                    ).y -
                                    that.getMaxDistance(
                                      JSON.parse(item.parameters)
                                    ) +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            }, // shape
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      }
                    } else if (item.shapeType == 5) {
                      var extendInfo = item.extendedInfo
                      const circleFeature = new AILabel.Feature.Circle(
                        item.id, // id
                        {
                          cx: JSON.parse(item.parameters).cx,
                          cy: JSON.parse(item.parameters).cy,
                          r: JSON.parse(item.parameters).r,
                        }, // shape
                        { props: null }, // props
                        {
                          strokeStyle:
                            item.objectType == 'group'
                              ? '#f00'
                              : 'rgba(0, 0, 0, 0)',
                          // globalAlpha: 1,
                          lineWidth: 2,
                        } // style
                      )
                      let featureId = item.id
                      that.linkedList[featureId] = {
                        type: item.objectType,
                        id: item.objectLinkId,
                        name: item.name,
                      }
                      that.featureLayer.addFeature(circleFeature)
                      if (item.objectType == 'map') {
                        if (
                          item.name &&
                          item.name.length > 0 &&
                          (!extendInfo || JSON.parse(extendInfo).showName)
                        ) {
                          const text = new AILabel.Text(
                            item.id,
                            {
                              text: item.name,
                              position: {
                                // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                                x: JSON.parse(item.parameters).cx,
                                y:
                                  JSON.parse(item.parameters).cy -
                                  JSON.parse(item.parameters).r,
                              },
                              offset: { x: (item.name.length - 1) * -2, y: 0 },
                            },
                            // item.parameters.props, // props
                            {
                              id: item.objectLinkId,
                              name: item.name,
                              type: 'title',
                              zIndex: 100,
                              showName: true,
                            },
                            // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                            {
                              font: 'normal 12px Arial',
                              zIndex: 5,
                              opacity: 1,
                              // fillStyle: "#0A72D1",
                              fillStyle: 'rgba(0, 0, 0, 0)',
                              fontColor: '#FFFFFF',
                              textAlign: 'left',
                              background: false,
                              // strokeStyle: "#0A72D1",
                              // strokeStyle: "#00FF00",
                              textBaseline: 'bottom',
                            }
                          )
                          that.textLayer.addText(text)
                          console.log('that.currentScale4', that.currentScale)
                          const polygonFeature = new AILabel.Feature.Polygon(
                            'title' + item.id,
                            {
                              points: [
                                //   { x: JSON.parse(item.parameters).cx - 10, y: JSON.parse(item.parameters).cy - 5 },
                                // { x: JSON.parse(item.parameters).cx + 18, y: JSON.parse(item.parameters).cy - 5 },
                                // { x: JSON.parse(item.parameters).cx + 18, y: JSON.parse(item.parameters).cy + 5 },
                                // { x: JSON.parse(item.parameters).cx - 10, y: JSON.parse(item.parameters).cy + 5 }
                                {
                                  x:
                                    JSON.parse(item.parameters).cx -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    item.name.length *
                                      1.45 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r -
                                    5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    item.name.length *
                                      1.45 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    4.5 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    2.5 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    4.5 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx +
                                    1 * (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                                {
                                  x:
                                    JSON.parse(item.parameters).cx -
                                    item.name.length *
                                      0.7 *
                                      (5.74 / that.scaleFactor),
                                  y:
                                    JSON.parse(item.parameters).cy -
                                    JSON.parse(item.parameters).r +
                                    2 * (5.74 / that.scaleFactor),
                                },
                              ],
                            }, // shape
                            { type: 'POLYGON', zIndex: 100, showName: false }, // props
                            {
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              fillStyle: 'rgba(50, 180, 180, 0.3)',
                              strokeStyle: '#FFFFFF',
                              // strokeStyle: "rgba(0, 0, 0, 0)",
                              lineWidth: 2,
                              fill: true,
                              stroke: true,
                            }
                          )
                          that.featureLayer.addFeature(polygonFeature)
                        }
                      } else if (item.objectType == 'group') {
                        const text = new AILabel.Text(
                          'title' + item.id,
                          {
                            text: item.name || '视频分组',
                            position: {
                              // x: JSON.parse(item.parameters)[0].x - (item.name.length * 10) / 2,
                              x: JSON.parse(item.parameters).cx,
                              y: JSON.parse(item.parameters).cy,
                            },
                            offset: {
                              x:
                                ((item.name.length == 0
                                  ? 4
                                  : item.name.length) -
                                  1) *
                                -4,
                              y: -10,
                            },
                          },
                          // item.parameters.props, // props
                          {
                            id: item.objectLinkId,
                            name: item.name || '视频分组',
                            type: 'title',
                            zIndex: 100,
                            showName: true,
                          },
                          // item.parameters.style || { fillStyle: "#00f", zIndex: 5 } // style
                          {
                            font: 'normal 12px Arial',
                            zIndex: 5,
                            opacity: 1,
                            // fillStyle: "#0A72D1",
                            fillStyle: that.configData.backgroundColor,
                            fontColor: that.configData.fontColor,
                            textAlign: 'left',
                            background: that.configData.setBackground,
                            // strokeStyle: "#0A72D1",
                            // strokeStyle: "#00FF00",
                            textBaseline: 'bottom',
                          }
                        )
                        that.textLayer.addText(text)
                      }
                    }
                  })
                  that.animationId = mapId
                  that.updateAnimation(mapId)
                  // 在图层上添加事件 放到标签及图形回显之后
                  setTimeout(function () {
                    that.addEvent(that.gMap, that.featureLayer, that.textLayer)
                  }, 50)
                  if (positionInfo) {
                    // sessionStorage.removeItem("positionInfo")
                    setTimeout(function () {
                      that.gMap.centerAndZoom({
                        center: { x: positionInfo.x, y: positionInfo.y },
                        zoom: that.currentZoom,
                      })
                      let cameraId = sessionStorage.getItem('cameraId')
                      if (cameraId) {
                        // const allTexts = that.textLayer.getAllTexts()
                        const allTexts = that.gMap.markerLayer.getAllMarkers()
                        for (let i = 0; i < allTexts.length; i++) {
                          if (cameraId == allTexts[i].props.extraId) {
                            that.targetFeature &&
                              that.featureLayer.removeFeatureById('target-rect')
                            that.targetFeature = addTargetRect(
                              that.gMap,
                              that.featureLayer,
                              that.textLayer,
                              {
                                props: {
                                  id: allTexts[i].props.extraId,
                                  showName: true,
                                  name: allTexts[i].props.name,
                                },
                                markerInfo: {
                                  position: {
                                    x: positionInfo.x,
                                    y: positionInfo.y,
                                  },
                                },
                              }
                            )
                            sessionStorage.removeItem('cameraId')
                            break
                          }
                        }
                      }
                      sessionStorage.removeItem('positionInfo')
                    }, 80)
                  }
                  const coordinates1 = sessionStorage.getItem('positionInfo')
                  if (coordinates1) {
                    setTimeout(function () {
                      that.gMap.centerAndZoom({
                        center: JSON.parse(coordinates1),
                        zoom: that.currentZoom,
                      })
                      // sessionStorage.removeItem("positionInfo")
                      let cameraId = sessionStorage.getItem('cameraId')
                      if (cameraId) {
                        // const allTexts = that.textLayer.getAllTexts()
                        const allTexts = that.gMap.markerLayer.getAllMarkers()
                        for (let i = 0; i < allTexts.length; i++) {
                          if (cameraId == allTexts[i].props.extraId) {
                            that.targetFeature &&
                              that.featureLayer.removeFeatureById('target-rect')
                            that.targetFeature = addTargetRect(
                              that.gMap,
                              that.featureLayer,
                              that.textLayer,
                              {
                                props: {
                                  id: allTexts[i].props.extraId,
                                  showName: true,
                                  name: allTexts[i].props.name,
                                },
                                markerInfo: {
                                  // position: positionInfo
                                  position: {
                                    x: JSON.parse(coordinates1).x,
                                    y: JSON.parse(coordinates1).y,
                                  },
                                },
                              }
                            )
                            sessionStorage.removeItem('cameraId')
                            break
                          }
                        }
                      }
                      sessionStorage.removeItem('positionInfo')
                    }, 80)
                  }
                  getMapTree().then((mapTree) => {
                    console.log('地图树3', mapTree)
                    var findResult = that.findParentIdById(mapId, mapTree.data)
                    if (findResult) {
                      var parentResult = that.findParentIdById(
                        findResult,
                        mapTree.data
                      )
                      console.log('parentResult3', parentResult)
                      if (parentResult == '0') {
                        that.levelList = []
                      } else {
                        that.levelList = []
                        that.levelList.push(parentResult)
                      }
                    } else {
                      that.levelList = []
                    }
                  })
                  // 查询regionId
                  getLineMap(mapId).then((res1) => {
                    console.log(res1.data, 'region数据3')
                    getLineTree(false, false).then((res2) => {
                      that.regionData = res2.data
                      that.addLevelToTree(that.regionData, 1)
                      let findData = that.findItemById(
                        that.regionData,
                        res1.data.regionId
                      )
                      console.log(findData)
                      const AncestorData = that.findAncestorWithLevel3(
                        findData.id
                      )
                      console.log(AncestorData, '第三层的父级')
                      if (findData.level == 1) {
                        // that.showStationList = false
                        // that.stationList = []
                        // that.stationIndex = -1
                        that.showToggleFloor = false
                        that.showToggleIndex = -1
                        that.showToggleName = ''
                        if (res1.data.showLine == false) {
                          that.showStationList = false
                          that.stationList = []
                          that.stationIndex = -1
                        } else {
                          getPeerRegion(findData.id).then((res3) => {
                            console.log(res3.data, '站点构造数据222')
                            if (res3.data.length > 0) {
                              that.showStationList = true
                              that.stationList = res3.data
                              that.stationIndex = that.stationList.findIndex(
                                (it) => it.id == findData.id
                              )
                            } else {
                              that.showStationList = false
                              that.stationList = []
                              that.stationIndex = -1
                            }
                          })
                        }
                      } else if (findData.level <= 3) {
                        getPeerRegion(res1.data.regionId).then((res3) => {
                          console.log(res3.data, '站点构造数据3')
                          if (res3.data.length > 0) {
                            that.stationList = res3.data
                            that.stationIndex = that.stationList.findIndex(
                              (it) => it.id == findData.id
                            )
                            let data = {
                              regionId: res1.data.regionId,
                              current: 1,
                              size: -1,
                              name: '',
                              flag: false,
                              type: '',
                            }
                            getMapByPage(data).then((res) => {
                              let tempList = res.data.records.filter(
                                (it) => it.deleteFlag == '0'
                              )
                              function customSort(a, b) {
                                if (a.type === b.type) {
                                  return a.sort - b.sort
                                } else {
                                  return a.type - b.type
                                }
                                // return a.sort - b.sort
                              }
                              let resultList = tempList.sort(customSort)
                              console.log(resultList, '楼层图2')
                              var toggleAllFloorList = resultList
                              sessionStorage.setItem(
                                'toggleAllFloorList',
                                JSON.stringify(toggleAllFloorList)
                              )
                              that.showToggleFloor = true
                              if (listInfo) {
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) => item.id === listInfo.id
                                  )
                                that.showToggleName =
                                  toggleAllFloorList[that.showToggleIndex].name
                              } else {
                                that.showToggleName = toggleAllFloorList.find(
                                  (item) => item.id === resultList[0].id
                                ).name
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) => item.id === resultList[0].id
                                  )
                              }
                              that.toggleAllFloorList = toggleAllFloorList //修复bug
                              if (res1.data.showLine == false) {
                                that.showStationList = false
                                that.stationList = []
                                that.stationIndex = -1
                              } else {
                                that.showStationList = true
                              }
                            })
                          } else {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                            that.showToggleFloor = false
                            that.toggleAllFloorList = []
                            that.showToggleIndex = -1
                            if (res1.data.showLine == false) {
                              that.showStationList = false
                              that.stationList = []
                              that.stationIndex = -1
                            }
                          }
                        })
                      } else {
                        getPeerRegion(AncestorData.id).then((res3) => {
                          console.log(res3.data, '站点构造数据22222')
                          if (res3.data.length > 0) {
                            that.stationList = res3.data
                            that.stationIndex = that.stationList.findIndex(
                              (it) => it.id == AncestorData.id
                            )
                            let data = {
                              regionId: res1.data.regionId,
                              current: 1,
                              size: -1,
                              name: '',
                              flag: true,
                              type: '',
                            }
                            getMapByPage(data).then((res) => {
                              let tempList = res.data.records.filter(
                                (it) => it.deleteFlag == '0'
                              )
                              function customSort(a, b) {
                                if (a.type === b.type) {
                                  return a.sort - b.sort
                                } else {
                                  return a.type - b.type
                                }
                                // return a.sort - b.sort
                              }
                              let resultList = tempList.sort(customSort)
                              var toggleAllFloorList = resultList
                              sessionStorage.setItem(
                                'toggleAllFloorList',
                                JSON.stringify(toggleAllFloorList)
                              )
                              that.showToggleFloor = true
                              if (Array.isArray(listInfo)) {
                                that.showToggleName = toggleAllFloorList.find(
                                  (item) => item.id === listInfo[0].objectLinkId
                                ).name
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) =>
                                      item.id === listInfo[0].objectLinkId
                                  )
                              } else if (typeof listInfo === 'object') {
                                that.showToggleName = toggleAllFloorList.find(
                                  (item) => item.id === mapId
                                ).name
                                that.showToggleIndex =
                                  toggleAllFloorList.findIndex(
                                    (item) => item.id === mapId
                                  )
                              }
                              // that.showToggleName = toggleAllFloorList.find(item => item.id === listInfo[0].objectLinkId).name
                              // that.showToggleIndex = toggleAllFloorList.findIndex(item => item.id === listInfo[0].objectLinkId)
                              that.toggleAllFloorList = toggleAllFloorList //修复bug
                              if (res1.data.showLine == false) {
                                that.showStationList = false
                                that.stationList = []
                                that.stationIndex = -1
                              } else {
                                that.showStationList = true
                              }
                            })
                          } else {
                            that.showStationList = false
                            that.stationList = []
                            that.stationIndex = -1
                            // if (res1.data.showLine == false) {
                            //   that.showStationList = false
                            //   that.stationList = []
                            //   that.stationIndex = -1
                            // }
                          }
                        })
                      }
                      // if (res1.data.showLine == false) {
                      //   alert(666)
                      //   that.showStationList = false
                      //   that.stationList = []
                      //   that.stationIndex = -1
                      // }
                    })
                  })
                  //查询结束
                  if (sessionStorage.getItem('hightlightInfo')) {
                    // alert('highlight');
                    let hightlightInfo = JSON.parse(
                      sessionStorage.getItem('hightlightInfo')
                    )
                    // sessionStorage.removeItem('hightlightInfo')
                    setTimeout(() => {
                      if (that.showVR) {
                        that.setCameraCenter(
                          hightlightInfo.labels[0].objectLinkId
                        )
                      } else {
                        that.targetFeature &&
                          that.featureLayer.removeFeatureById('target-rect')
                        that.targetFeature = null
                        that.targetFeature = addTargetRect(
                          that.gMap,
                          that.featureLayer,
                          that.textLayer,
                          {
                            props: {
                              id: hightlightInfo.labels[0].objectLinkId,
                              showName: false,
                              name: hightlightInfo.labels[0].name,
                            },
                            markerInfo: {
                              position: {
                                x: JSON.parse(
                                  hightlightInfo.labels[0].parameters
                                )[0].x,
                                y: JSON.parse(
                                  hightlightInfo.labels[0].parameters
                                )[0].y,
                              },
                            },
                          }
                        )
                      }
                    }, 500)
                  }
                })
                .catch((err) => {
                  // 错误处理
                  console.error('错误:', err)
                })
                .finally(() => {
                  // 无论成功或失败都会执行
                  // if (sessionStorage.getItem('hightlightInfo')) {
                  //   let hightlightInfo = JSON.parse(
                  //     sessionStorage.getItem('hightlightInfo')
                  //   )
                  //   sessionStorage.removeItem('hightlightInfo')
                  //   if (that.showVR) {
                  //     that.highlightCameraSprite(
                  //       hightlightInfo.labels[0].objectLinkId
                  //     )
                  //   } else {
                  //     that.targetFeature &&
                  //       that.featureLayer.removeFeatureById('target-rect')
                  //     that.targetFeature = null
                  //     that.targetFeature = addTargetRect(
                  //       that.gMap,
                  //       that.featureLayer,
                  //       that.textLayer,
                  //       {
                  //         props: {
                  //           id: hightlightInfo.labels[0].objectLinkId,
                  //           showName: false,
                  //           name: hightlightInfo.labels[0].name,
                  //         },
                  //         markerInfo: {
                  //           position: {
                  //             x: JSON.parse(
                  //               hightlightInfo.labels[0].parameters
                  //             )[0].x,
                  //             y: JSON.parse(
                  //               hightlightInfo.labels[0].parameters
                  //             )[0].y,
                  //           },
                  //         },
                  //       }
                  //     )
                  //   }
                  // }
                })
            }
            setTimeout(function () {
              console.log(that.gMap.getScale(), '***4')
              console.log(that.gMap.getCenter(), '***5')
              that.firstPosition = that.gMap.getCenter()
              that.firstScale = that.gMap.getScale()
            }, 100)
          }

          that.gMap.setMode('PAN')
          that.listInfo = listInfo
        }
      })
    },
    //渲染动画
    updateAnimation(id, positionParameters) {
      var that = this
      // getMenuByType(1).then(res => {
      //   let temp = res.data.filter(it => it.code == "A03001")
      //   if (temp.length == 0) {
      //     return
      //   } else {
      //通过地图id查询报警闪烁动画数组
      getAlarmLabel(id).then((res1) => {
        console.log(res1.data, '****报警闪烁数据****')
        that.deviceList = []
        that.polyList = []
        res1.data.forEach((item) => {
          console.log(item, that.savedJsonList)
          let temporaryList = that.savedJsonList.filter(
            (items) =>
              items.id === item &&
              (items.shapeType == 3 || items.shapeType == 5)
          )
          console.log(temporaryList)
          if (temporaryList.length > 0) {
            //多边形闪烁
            for (let j = 0; j < temporaryList.length; j++) {
              that.polyList.push(JSON.parse(temporaryList[j].parameters))
            }
            // that.polyList.push(JSON.parse(temporaryList[0].parameters))
          }
        })
        //设备水波纹扩散
        let data1 = {
          current: 1,
          size: -1,
          alarmLevel: '',
          objectType: [],
          // regionId: [],
          regionId: null,
        }
        getRealtimeAlarmList(data1).then((res2) => {
          that.alarmList = res2.data.records
          res2.data.records.forEach((ite) => {
            let alarmObjId = ite.alarmObjId
            let tempFindList = that.savedJsonList.find(
              (it) => it.shapeType == 1 && it.objectLinkId == alarmObjId
            )
            if (tempFindList) {
              that.deviceList.push(tempFindList)
            }
          })
          console.log('当前页面报警多边形数组', that.polyList)
          console.log('当前页面报警设备数组', that.deviceList)
          // setTimeout(function () {
          that.setCanvas(positionParameters)
          // }, 100)
        })
      })
      //   }
      // })
    },
    //渲染VR报警动画
    updateVrAnimation() {
      var that = this
      that.vrList = []
      let data1 = {
        current: 1,
        size: -1,
        alarmLevel: '',
        objectType: [],
        // regionId: [],
        regionId: null,
      }
      getRealtimeAlarmList(data1).then((res2) => {
        that.alarmList = res2.data.records
        res2.data.records.forEach((ite) => {
          let alarmObjId = ite.alarmObjId
          let tempFindList = that.dataList.label.find(
            (it) => it.id == alarmObjId
          )
          if (tempFindList) {
            that.vrList.push(tempFindList.id)
          }
        })
        console.log('当前VR页面报警设备数组', that.vrList)
      })
      // getAlarmLabel(id).then((res1) => {
      //   console.log(res1.data, '****报警闪烁数据****')
      //   that.deviceList = []
      //   that.polyList = []
      //   res1.data.forEach((item) => {
      //     console.log(item, that.savedJsonList)
      //     let temporaryList = that.savedJsonList.filter(
      //       (items) =>
      //         items.id === item &&
      //         (items.shapeType == 3 || items.shapeType == 5)
      //     )
      //     console.log(temporaryList)
      //     if (temporaryList.length > 0) {
      //       //多边形闪烁
      //       for (let j = 0; j < temporaryList.length; j++) {
      //         that.polyList.push(JSON.parse(temporaryList[j].parameters))
      //       }
      //       // that.polyList.push(JSON.parse(temporaryList[0].parameters))
      //     }
      //   })
      //   //设备水波纹扩散
      //   let data1 = {
      //     current: 1,
      //     size: -1,
      //     alarmLevel: '',
      //     objectType: [],
      //     // regionId: [],
      //     regionId: null,
      //   }
      // getRealtimeAlarmList(data1).then((res2) => {
      //   that.alarmList = res2.data.records
      //   res2.data.records.forEach((ite) => {
      //     let alarmObjId = ite.alarmObjId
      //     let tempFindList = that.savedJsonList.find(
      //       (it) => it.shapeType == 1 && it.objectLinkId == alarmObjId
      //     )
      //     if (tempFindList) {
      //       that.deviceList.push(tempFindList)
      //     }
      //   })
      //   console.log('当前页面报警多边形数组', that.polyList)
      //   console.log('当前页面报警设备数组', that.deviceList)
      //   that.setCanvas(positionParameters)
      // })
      // })
    },
    setCanvas(positionParameters) {
      var that = this
      console.log('setCanvas报警多边形数组', that.polyList)
      console.log('setCanvas报警设备数组', that.deviceList)
      const canvas = document.getElementById('myCanvas')
      // if (canvas) {
      //   const ctx = canvas.getContext("2d")
      // } else {
      //   return
      // }
      const ctx = canvas.getContext('2d')
      canvas.width = that.canvasContainerWidth
      canvas.height = that.canvasContainerHeight
      that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
      that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
      that.animationFrameId = null
      that.rippleAnimationId = null
      let polygonOpacity = 0
      let opacityDirection = 1
      let rippleRadius = 0
      // var img = new Image()
      // img.crossOrigin = ''
      // img.src = that.imgUrl
      that.tempScale = that.gMap.getScale() / that.firstScale + 0.002
      that.leftOrigin =
        (that.gMap.getCenter().x * that.gMap.getScale() -
          that.firstPosition.x * that.firstScale) *
        -1
      that.rightOrigin =
        (that.gMap.getCenter().y * that.gMap.getScale() -
          that.firstPosition.y * that.firstScale) *
        -1
      // img.onload = function () {
      // var scaleFactor = Math.min(that.containerWidth / img.width, that.containerHeight / img.height)
      // that.scaleFactor = scaleFactor
      // if ((img.width / img.height) < (that.containerWidth / that.containerHeight)) {
      //   that.canvasContainerWidth = Math.round(img.width * (that.containerHeight / img.height))
      //   that.canvasContainerHeight = that.containerHeight
      //   that.left = Math.round((that.containerWidth - that.canvasContainerWidth) / 2)
      //   that.top = 0
      // } else {
      //   that.canvasContainerWidth = that.containerWidth
      //   that.canvasContainerHeight = Math.round(img.height * (that.containerWidth / img.width))
      //   that.left = 0
      //   that.top = Math.round((that.containerHeight - that.canvasContainerHeight) / 2)
      // }
      function drawPolygons() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //多边形闪烁
        that.polyList.forEach((polygonPoints) => {
          if (polygonPoints.length > 0) {
            ctx.fillStyle = `rgba(255, 0, 0, ${polygonOpacity})`
            ctx.beginPath()
            ctx.moveTo(
              polygonPoints[0].x * that.scaleFactor,
              polygonPoints[0].y * that.scaleFactor
            )
            for (let i = 1; i < polygonPoints.length; i++) {
              ctx.lineTo(
                polygonPoints[i].x * that.scaleFactor,
                polygonPoints[i].y * that.scaleFactor
              )
            }
            ctx.closePath()
            ctx.fill()
          } else {
            ctx.fillStyle = `rgba(255, 0, 0, ${polygonOpacity})`
            ctx.beginPath()
            ctx.arc(
              polygonPoints.cx * that.scaleFactor,
              polygonPoints.cy * that.scaleFactor,
              polygonPoints.r * that.scaleFactor,
              0,
              2 * Math.PI
            )
            ctx.closePath()
            ctx.fill()
          }
        })

        // 控制透明度渐变
        polygonOpacity += 0.1 * opacityDirection

        if (polygonOpacity >= 1 || polygonOpacity <= 0) {
          // 切换渐变方向
          opacityDirection *= -1
        }
        that.animationFrameId = requestAnimationFrame(drawPolygons)
      }
      function drawRipples() {
        // ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 绘制报警设备波纹扩散动画
        ctx.fillStyle = `rgba(255, 0, 0, 0.9)`
        for (let j = 0; j < that.deviceList.length; j++) {
          ctx.beginPath()
          ctx.arc(
            JSON.parse(that.deviceList[j].parameters)[0].x * that.scaleFactor,
            JSON.parse(that.deviceList[j].parameters)[0].y * that.scaleFactor,
            rippleRadius,
            0,
            Math.PI * 2
          )
          ctx.closePath()
          ctx.fill()
        }

        // 控制波纹扩散速度
        rippleRadius += 0.4
        if (rippleRadius > 16) {
          rippleRadius = 0
        }

        // 重新启动报警设备波纹扩散动画
        that.rippleAnimationId = requestAnimationFrame(drawRipples)
      }
      that.animationFrameId = requestAnimationFrame(drawPolygons) // 启动动画
      that.rippleAnimationId = requestAnimationFrame(drawRipples) // 启动动画
      // }
      console.log(that.deviceList, '%%%%%%%%%%%%%%设备列表%%%%%%%%%%%%%%%%')
      console.log(that.polyList, '%%%%%%%%%%%%%%多边形列表%%%%%%%%%%%%%%%%')
      if (positionParameters) {
        console.log('居中信息', positionParameters)
        setTimeout(function () {
          that.gMap.centerAndZoom({
            center: { x: positionParameters.x, y: positionParameters.y },
            zoom: that.currentZoom,
          })
          let cameraId = sessionStorage.getItem('cameraId')
          if (cameraId) {
            // const allTexts = that.textLayer.getAllTexts()
            const allTexts = that.gMap.markerLayer.getAllMarkers()
            for (let i = 0; i < allTexts.length; i++) {
              if (cameraId == allTexts[i].props.extraId) {
                that.targetFeature &&
                  that.featureLayer.removeFeatureById('target-rect')
                that.targetFeature = addTargetRect(
                  that.gMap,
                  that.featureLayer,
                  that.textLayer,
                  {
                    props: {
                      id: allTexts[i].props.extraId,
                      showName: true,
                      name: allTexts[i].props.name,
                    },
                    markerInfo: {
                      // position: positionParameters
                      position: {
                        x: positionParameters.x,
                        y: positionParameters.y,
                      },
                    },
                  }
                )
                sessionStorage.removeItem('cameraId')
                break
              }
            }
          }
        }, 80)
      }
    },

    // 增加事件
    addEvent(gMap, featureLayer, textLayer) {
      // 监听图形绘制完成
      var that = this
      gMap.events.on('drawDone', (type, data) => {
        console.log('--type, data--', type, data)
        if (type === 'MARKER') {
          console.log(this.allFeatures, '*******已保存数据*********')
          const props = {
            name:
              this.markerItem.name ||
              `摄像机${++this.index < 10 ? '0' + this.index : ++this.index}`,
            id: this.markerItem.id,
            showName: true,
            zIndex: 100,
          }
          // 添加摄像机
          this.createMarker({
            gMap,
            textLayer,
            data,
            type,
            markerUrl: this.markerUrl,
            props,
          })
          // 添加文本
          addFeature({ gMap, textLayer, data, type: 'TEXT', props })
          console.log(this.markerType, this.markerItem)
          if (this.markerType && this.markerItem) {
            this.$emit('addSuccess', this.markerType, this.markerItem)
          }
          this.menuVisible = false
          this.visibleFeature = false
          this.gMap.setMode('BAN')
        } else if (this.command) {
          const allMarkers = gMap.markerLayer.getAllMarkers()
          const markers = []
          that.allCameraMarkers = []
          that.selectedCameraMarkers = []
          // alert(666)
          console.log('allMarkers', allMarkers)
          allMarkers.forEach((item) => {
            const position = item.markerInfo.position
            if (
              position.x >= data.x &&
              position.x <= data.x + data.width &&
              position.y > data.y &&
              position.y <= data.y + data.height
            ) {
              markers.push(item)
            }
            if (item.props.type == 'camera') {
              that.allCameraMarkers.push(item.props.extraId)
            }
          })
          console.log('框选的camera', markers)
          // 水平垂直居中根据y坐标排序
          if (this.command === 'items-center') {
            markers.sort((a, b) => {
              return a.markerInfo.position.y - b.markerInfo.position.y
            })
            this.gMap.setMode('BAN')
            // 水平方向平均分配
          } else if (this.command === 'justify-every') {
            markers.sort((a, b) => {
              return a.markerInfo.position.x - b.markerInfo.position.x
            })
            this.gMap.setMode('BAN')
          } else if (
            this.command === 'items-every' ||
            this.command === 'left' ||
            this.command === 'right'
          ) {
            markers.sort((a, b) => {
              return a.markerInfo.position.y - b.markerInfo.position.y
            })
            this.gMap.setMode('BAN')
          } else if (this.command === 'RECT') {
            markers.forEach((it) => {
              if (it.props.type == 'camera') {
                that.selectedCameraMarkers.push(it.props.extraId)
              }
            })
            // alert(666)
            console.log('markers', markers)
            // that.gMap.setMode("BAN")
            if (that.selectedCameraMarkers.length == 0) {
              this.$message.warning('最少选择1个监控点，请重新框选')
            } else if (that.selectedCameraMarkers.length > 9) {
              this.$message.warning('最多选择9个监控点，请重新框选')
            } else {
              console.log('allCameraMarkers', that.allCameraMarkers)
              console.log('selectedCameraMarkers', that.selectedCameraMarkers)
              this.command = ''
              this.gMap.setMode('PAN')
              // let action = {
              //   type: 103,
              //   isRealVideo: 1,
              //   startPosition: "centerScreen",
              //   cameraIds: that.allCameraMarkers,
              //   data: that.selectedCameraMarkers
              // }
              // this.$parent.$parent.$parent.$parent.toOpenCamera(JSON.stringify(action))
              this.activeFour = false
              // alert(1)
              // that.selectedCameraMarkers = []
            }
          }
          markers.forEach((markerFeature, i) => {
            // console.log(markerFeature);
            const num = 70 * i
            switch (this.command) {
              case 'left':
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({ x: 0, y: num })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: 0, y: num },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'right':
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({
                  x: gMap.getSize().width,
                  y: num,
                })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: gMap.getSize().width, y: num },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'items-start':
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({ x: num, y: 0 })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: num, y: 0 },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'items-end':
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({
                  x: num,
                  y: gMap.getSize().height - 30,
                })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: num, y: gMap.getSize().height - 30 },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'justify-center':
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({
                  x: gMap.getSize().width / 2,
                  y: num,
                })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: gMap.getSize().width / 2, y: num },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'items-center':
                const x = gMap.getSize().width / 2
                const y = gMap.getSize().height / 2
                deleteText(textLayer, markerFeature.props)
                if (markers.length / 2 === i) {
                  markerFeature.updatePosition({ x, y })
                  markerFeature.props.showName &&
                    addFeature({
                      gMap,
                      textLayer,
                      data: { x, y },
                      type: 'TEXT',
                      props: markerFeature.props,
                    })
                } else if (parseInt(markers.length / 2) > i) {
                  markerFeature.updatePosition({ x, y: y + num })
                  markerFeature.props.showName &&
                    addFeature({
                      gMap,
                      textLayer,
                      data: { x, y: y + num },
                      type: 'TEXT',
                      props: markerFeature.props,
                    })
                } else {
                  markerFeature.updatePosition({ x, y: y - num })
                  markerFeature.props.showName &&
                    addFeature({
                      gMap,
                      textLayer,
                      data: { x, y: y - num },
                      type: 'TEXT',
                      props: markerFeature.props,
                    })
                }
                break
              case 'justify-every':
                const everyX = (gMap.getSize().width / (markers.length - 1)) * i
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({
                  x: everyX,
                  y: gMap.getSize().height / 2,
                })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: everyX, y: gMap.getSize().height / 2 },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              case 'items-every':
                const everyY =
                  (gMap.getSize().height / (markers.length - 1)) * i - 30
                deleteText(textLayer, markerFeature.props)
                markerFeature.updatePosition({
                  x: gMap.getSize().width / 2,
                  y: everyY,
                })
                markerFeature.props.showName &&
                  addFeature({
                    gMap,
                    textLayer,
                    data: { x: gMap.getSize().width / 2, y: everyY },
                    type: 'TEXT',
                    props: markerFeature.props,
                  })
                break
              default:
                break
            }
          })

          // console.log(markers);
        } else {
          // 添加图形
          if (type == 'CIRCLE' || type == 'RECT' || type == 'POLYGON') {
            this.menuVisible = false
            this.visibleFeature = true
            addFeature({ gMap, featureLayer, data, type })
            this.gMap.setMode('BAN')
          } else {
            this.menuVisible = false
            this.visibleFeature = false
            addFeature({ gMap, featureLayer, data, type })
            this.gMap.setMode('BAN')
          }
          // this.menuVisible = false;
          // this.visibleFeature = true;
        }
        // this.setMode("PAN")
        // this.setMode("BAN")
        // 地图模式上移
        // this.gMap.setMode("BAN")
        // 绘制完成获取所有的图形和文本
        this.allFeatures = getAllFeatures(featureLayer)
        this.allTexts = textLayer.getAllTexts()
        console.log(this.allFeatures, this.allTexts, '****绘制完成*****')
        this.formLink.test.id = ''
        // this.menuVisible = false;
        // this.visibleFeature = true;
        if (this.allFeatures.length > 0) {
          this.lastId = this.allFeatures[this.allFeatures.length - 1].id
          console.log(this.lastId)
          this.linkedList[this.lastId] = {
            type: 'map',
            id: '',
            // note: "",
          }
        }
        if (this.allTexts.length > 0) {
          this.lastIdCamera = this.allTexts[this.allTexts.length - 1].id
          console.log(this.lastIdCamera)
          // this.linkedListCamera[this.lastIdCamera] = this.markerItem.id
        }
      })
      // 监听图形单击
      gMap.events.on('click', (points) => {
        var that = this
        console.log('click单击')
        console.log(that.gMap.markerLayer)
        console.log(that.gMap.mLayer)
        // that.setCanvas()
        console.log(this.gMap.zoom, '容器大小***zoom值')
        console.log(this.gMap.getSize(), '容器大小***4')
        console.log(this.gMap.getScale(), '缩放***5')
        console.log(this.gMap.getBounds(), '边界信息***6')
        console.log(this.gMap.getCenter(), '中心位置***7')
        const targetFeature = gMap.getTargetFeatureWithPoint(points.global)
        console.log(targetFeature)
        that.featureLayer.removeFeatureById('target-rect')
        // console.log(targetFeature.shape.points)

        // if (targetFeature.__proto__.constructor.name == 'PolygonFeature') {
        // if (targetFeature && targetFeature.type == "POLYGON") {
        //   that.targetFeatureId = targetFeature.id
        //   let tempList = []
        //   for (let i = 0; i < targetFeature.shape.points.length; i++) {
        //     tempList[i] = []
        //     tempList[i].push(targetFeature.shape.points[i].x, targetFeature.shape.points[i].y)
        //   }
        //   console.log(tempList)
        //   this.drawImage(this.imgUrl, tempList)
        // }
        // console.log(targetFeature.id);
        console.log(this.featureLayer)
        console.log(document.getElementById(this.featureLayer.domId))

        //所有画线的canvas容器
        console.log(document.getElementById(this.featureLayer.domId))
        // if (that.selectedCameraMarkers.length > 0 && !that.activeFour) {
        if (
          that.selectedCameraMarkers.length == 0 &&
          sessionStorage.getItem('connectFlag1') == 'success'
        ) {
          var actionOne = {
            type: 103,
            isRealVideo: 1,
            startPosition: 'rightScreen',
            cameraIds: that.allCameraMarkers,
            data: [],
          }
          that.toOpenCamera(JSON.stringify(actionOne))
        } else if (
          that.selectedCameraMarkers.length > 0 &&
          that.selectedCameraMarkers.length <= 9
        ) {
          var actionOne = {
            type: 103,
            isRealVideo: 1,
            startPosition: 'centerScreen',
            cameraIds: that.allCameraMarkers,
            data: that.selectedCameraMarkers,
          }
          that.toOpenCamera(JSON.stringify(actionOne))
          that.selectedCameraMarkers = []
        } else {
        }
      })
      // 监听图形双击
      gMap.events.on('dblClick', (points) => {
        console.log('dblClick双击111')
        var that = this
        const targetFeature = gMap.getTargetFeatureWithPoint(points.global)
        console.log(targetFeature, 'targetFeature')
        if (!targetFeature || targetFeature.id.startsWith('title')) return
        let jumpList = this.savedJsonList.filter(
          (item) => item.id == targetFeature.id
        )
        console.log(jumpList, '跳转列表********************************')
        if (jumpList.length > 0 && jumpList[0].objectType == 'map') {
          if (jumpList[0].objectLinkId && jumpList[0].thumbnailUrl) {
            that.polyList = []
            that.deviceList = []
            that.gMap && that.gMap.markerLayer.removeAllMarkers()
            that.textLayer && that.textLayer.removeAllTexts()
            that.featureLayer && that.featureLayer.removeAllFeatures()
            that.gMap && that.gMap.removeLayerById('first-layer-image')
            var mapHistory = JSON.parse(sessionStorage.getItem('mapHistory'))
            mapHistory.push(jumpList[0])
            sessionStorage.setItem('mapHistory', JSON.stringify(mapHistory))
            // that.operateList.push(jumpList[0])
            // sessionStorage.setItem(
            //   'mapHistory',
            //   JSON.stringify(that.operateList)
            // )
            that.jumpList = jumpList
            this.imgUrl = jumpList[0].thumbnailUrl
            // this.imgUrl = 'http://192.168.1.175:8090' + jumpList[0].thumbnailUrl
            // 查询父节点并给levelList赋值
            // getMapTree().then(mapTree => {
            //   console.log('地图树', mapTree)
            //   var findResult = that.findParentIdById(jumpList[0].id, mapTree.data)
            //   if (findResult) {
            //     var parentResult = that.findParentIdById(findResult, mapTree.data)
            //     console.log('parentResult', parentResult)
            //     if (parentResult == "0") {
            //       that.levelList = []
            //     } else {
            //       that.levelList = []
            //       that.levelList.push(parentResult)
            //     }
            //   } else {
            //     that.levelList = []
            //   }
            // })
            // this.imgUrl = 'http://192.168.1.175:8090' + jumpList[0].thumbnailUrl
            var canvas = document.getElementById('imgDom')
            if (canvas) {
              var ctx = canvas.getContext('2d')
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.beginPath()
            }
            var canvas1 = document.getElementById('tempCanvas')
            if (canvas1) {
              var ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
              ctx1.beginPath()
            }
            var canvas2 = document.getElementById('myCanvas')
            if (canvas2) {
              var ctx2 = canvas2.getContext('2d')
              ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
              ctx2.beginPath()
            }
            this.showClip = false
            // this.gMap.markerLayer.removeAllMarkers()
            // this.textLayer.removeAllTexts()
            // this.featureLayer.removeAllFeatures()
            console.log(jumpList[0], '****')
            this.showToggleFloor = false
            this.showStationList = false
            this.initMap(
              jumpList[0].objectLinkId,
              jumpList,
              jumpList[0].objectLinkId
            )
            // if (jumpList[0].objectLinkId && objectLinkId[0].thumbnailUrl) {
            //   this.showToggleFloor = false
            //   this.showStationList = false
            //   this.initMap(jumpList[0].id, jumpList, jumpList[0].objectLinkId)
            // } else {
            //   this.$message.info('请先配置该区域的关联地图')
            //   return
            // }
          } else {
            var canvas = document.getElementById('imgDom')
            if (canvas) {
              var ctx = canvas.getContext('2d')
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.beginPath()
            }
            var canvas1 = document.getElementById('tempCanvas')
            if (canvas1) {
              var ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
              ctx1.beginPath()
            }
            var canvas2 = document.getElementById('myCanvas')
            if (canvas2) {
              var ctx2 = canvas2.getContext('2d')
              ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
              ctx2.beginPath()
            }
            // this.canvasContainerWidth = 0
            // this.canvasContainerHeight = 0
            this.showClip = false
            // sessionStorage.setItem("toggleAllFloorList", JSON.stringify([]))
            // this.toggleAllFloorList = [] //修复bug
            this.$message.info('请先配置该区域的关联信息')
            return
          }
        } else if (jumpList.length > 0 && jumpList[0].objectType == 'group') {
          console.log(jumpList[0].objectLinkId, '分组id')
          if (jumpList[0].objectLinkId) {
            getResourceGroupData(jumpList[0].objectLinkId).then((res) => {
              console.log(res.data)
              if (res.data.length > 0) {
                const ids = res.data.map((item) => item.deviceId)
                var actionOne = {
                  type: 103,
                  isRealVideo: 1,
                  startPosition: 'centerScreen',
                  cameraIds: that.allCameraMarkers,
                  data: ids,
                }
                that.toOpenCamera(JSON.stringify(actionOne))
              } else {
                this.$message.info('该分组暂无设备信息')
                return
              }
            })
          } else {
            this.$message.info('请配置关联的分组对象')
            return
          }
        } else if (jumpList.length > 0 && jumpList[0].objectType == '3D') {
          console.log(jumpList[0], 777, '分组id1')
          that.gMap && that.gMap.destroy()
          that.animationFrameId && cancelAnimationFrame(that.animationFrameId)
          that.rippleAnimationId && cancelAnimationFrame(that.rippleAnimationId)
          that.animationFrameId = null
          that.rippleAnimationId = null
          that.initCesium(jumpList[0].objectLinkId)
        } else {
          var canvas = document.getElementById('imgDom')
          if (canvas) {
            var ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.beginPath()
          }
          var canvas1 = document.getElementById('tempCanvas')
          if (canvas1) {
            var ctx1 = canvas1.getContext('2d')
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
            ctx1.beginPath()
          }
          var canvas2 = document.getElementById('myCanvas')
          if (canvas2) {
            var ctx2 = canvas2.getContext('2d')
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
            ctx2.beginPath()
          }
          // this.canvasContainerWidth = 0
          // this.canvasContainerHeight = 0
          this.showClip = false
          // sessionStorage.setItem("toggleAllFloorList", JSON.stringify([]))
          // this.toggleAllFloorList = [] //修复bug
          this.$message.info('请先配置该区域的关联信息')
          return
        }
        // alert(objectLinkId)
        // console.log(this.mapList)
      })
      let feature = null
      let zoomOut = false
      let zoomIn = false
      // 监听鼠标移入
      gMap.events.on('mouseMove', (points) => {
        if (!this.mode || this.mode === 'PAN') {
          const targetFeature = this.gMap.getTargetFeatureWithPoint(
            points.global
          )
          if (targetFeature) {
            console.log(targetFeature, '目标图形')
            feature = targetFeature
            that.targetFeature = targetFeature
            const targetId = targetFeature.id
            const targetType = 'group'
            const exists = that.savedJsonList.some(
              (item) => item.id === targetId && item.objectType === targetType
            )
            if (exists) {
              console.log(`ID ${targetId} 存在于数组中`)
              return
            } else {
              console.log(`ID ${targetId} 不存在于数组中`)
              if (targetFeature.type != 'CIRCLE') {
                var twoDimArray = targetFeature.shape.points.map(function (
                  obj
                ) {
                  return [obj.x, obj.y]
                })
                // alert(twoDimArray.length)
                if (
                  !targetFeature.id.startsWith('title') &&
                  !targetFeature.id.startsWith('group') &&
                  that.command !== 'RECT'
                ) {
                  // const allTexts = that.textLayer.getAllTexts()
                  // const ObjectItem = allTexts.find(it => it.id == that.targetFeature.id)
                  // if (ObjectItem) {
                  //   that.textLayer.removeTextById(ObjectItem.id)
                  // }
                  // this.featureLayer.removeFeatureById("title" + that.targetFeature.id)
                  that.drawImage(that.imgUrl, twoDimArray)
                }
                // mouseOver(targetFeature)
                zoomOut = true
                zoomIn = false
              } else {
                // 圆形放大
                console.log('this.featureLayer', this.featureLayer)
                console.log(targetFeature.shape.cx, '圆心横坐标')
                console.log(targetFeature.shape.cy, '圆心纵坐标')
                console.log(targetFeature.shape.r, '圆半径')
                // const allTexts = that.textLayer.getAllTexts()
                // const ObjectItem = allTexts.find(it => it.id == that.targetFeature.id)
                // if (ObjectItem) {
                //   that.textLayer.removeTextById(ObjectItem.id)
                // }
                // this.featureLayer.removeFeatureById("title" + that.targetFeature.id)
                that.drawCircle(
                  that.imgUrl,
                  targetFeature.shape.cx,
                  targetFeature.shape.cy,
                  targetFeature.shape.r
                )
              }
            }
          } else {
            // if (that.targetFeature) {
            //   const item = that.savedJsonList.find(it => it.id == that.targetFeature.id)
            //   if (item) {
            //     if (item.shapeType == 3) {
            //       var extendInfo = item.extendedInfo
            //       if (item.name && item.name.length > 0 && (!extendInfo || JSON.parse(extendInfo).showName)) {
            //         const text = new AILabel.Text(
            //           item.id,
            //           {
            //             text: item.name,
            //             position: {
            //               x: that.getCenterPosition(JSON.parse(item.parameters)).x,
            //               y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters))
            //             },
            //             offset: { x: (item.name.length - 1) * (-4), y: -10 },
            //           },
            //           { id: item.objectLinkId, name: item.name, type: "title", zIndex: 100, showName: true },
            //           {
            //             font: "normal 12px Arial",
            //             zIndex: 5,
            //             opacity: 1,
            //             fillStyle: "rgba(0, 0, 0, 0)",
            //             fontColor: "#FFFFFF",
            //             textAlign: "left",
            //             background: false,
            //             textBaseline: "bottom"
            //           }
            //         )
            //         that.textLayer.addText(text)
            //         const polygonFeature = new AILabel.Feature.Polygon(
            //           "title" + item.id,
            //           {
            //             points: [
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x - 10 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) - 5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 18 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) - 5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 18 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 5.5 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 4 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 7.5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x + 2.5 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 5 * (5.74 / that.scaleFactor) },
            //               { x: that.getCenterPosition(JSON.parse(item.parameters)).x - 10 * (5.74 / that.scaleFactor), y: that.getCenterPosition(JSON.parse(item.parameters)).y - that.getMaxDistance(JSON.parse(item.parameters)) + 5 * (5.74 / that.scaleFactor) },
            //             ]
            //           },
            //           { type: "POLYGON", zIndex: 100, showName: false }, // props
            //           {
            //             fillStyle: "rgba(50, 180, 180, 0.3)",
            //             strokeStyle: "#FFFFFF",
            //             lineWidth: 2,
            //             fill: true,
            //             stroke: true,
            //           }
            //         )
            //         that.featureLayer.addFeature(polygonFeature)
            //       }
            //     } else if (item.shapeType == 5) {
            //       var extendInfo = item.extendedInfo
            //       if (item.name && item.name.length > 0 && (!extendInfo || JSON.parse(extendInfo).showName)) {
            //         const text = new AILabel.Text(
            //           item.id,
            //           {
            //             text: item.name,
            //             position: {
            //               x: JSON.parse(item.parameters).cx,
            //               y: JSON.parse(item.parameters).cy - JSON.parse(item.parameters).r*2,
            //             },
            //             offset: { x: (item.name.length - 1) * (-4), y: -10 },
            //           },
            //           { id: item.objectLinkId, name: item.name, type: "title", zIndex: 100, showName: true },
            //           {
            //             font: "normal 12px Arial",
            //             zIndex: 5,
            //             opacity: 1,
            //             fillStyle: "rgba(0, 0, 0, 0)",
            //             fontColor: "#FFFFFF",
            //             textAlign: "left",
            //             background: false,
            //             textBaseline: "bottom"
            //           }
            //         )
            //         that.textLayer.addText(text)
            //         const polygonFeature = new AILabel.Feature.Polygon(
            //           "title" + item.id,
            //           {
            //             points: [
            //               { x: JSON.parse(item.parameters).cx - 10 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 - 5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx + 18 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 - 5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx + 18 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 + 5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx + 5.5 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 + 5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx + 4 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 + 7.5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx + 2.5 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 + 5 * (5.74 / that.scaleFactor) },
            //               { x: JSON.parse(item.parameters).cx - 10 * (5.74 / that.scaleFactor), y: JSON.parse(item.parameters).cy- JSON.parse(item.parameters).r*2 + 5 * (5.74 / that.scaleFactor) }
            //             ]
            //           },
            //           { type: "POLYGON", zIndex: 100, showName: false }, // props
            //           {
            //             fillStyle: "rgba(50, 180, 180, 0.3)",
            //             strokeStyle: "#FFFFFF",
            //             lineWidth: 2,
            //             fill: true,
            //             stroke: true,
            //           }
            //         )
            //         that.featureLayer.addFeature(polygonFeature)
            //       }
            //     }
            //   }
            // }
            that.targetFeature = null
            // if (feature && feature.shape) {
            //   if (!zoomIn) {
            //     // mouseOut(feature)
            //     zoomIn = true
            //     zoomOut = false
            //   }
            // }
            var canvas = document.getElementById('imgDom')
            if (canvas) {
              var ctx = canvas.getContext('2d')
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.beginPath()
            }
            var canvas1 = document.getElementById('tempCanvas')
            if (canvas1) {
              var ctx1 = canvas1.getContext('2d')
              ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
              ctx1.beginPath()
            }
            var canvas2 = document.getElementById('myCanvas')
            if (canvas2) {
              var ctx2 = canvas2.getContext('2d')
              ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
              ctx2.beginPath()
            }
            // this.canvasContainerWidth = 0
            // this.canvasContainerHeight = 0
            this.showClip = false
          }
        }
      })
      // 监听鼠标移出
      // gMap.events.on("mouseOut", (points) => {
      //   if (!this.mode || this.mode === "PAN") {
      //     const targetFeature = this.gMap.getTargetFeatureWithPoint(points.global)
      //     console.log(targetFeature,"移到外面1")
      //     if (targetFeature) {
      //       var canvas = document.getElementById('imgDom')
      //       var ctx = canvas.getContext('2d')
      //       ctx.clearRect(0, 0, canvas.width, canvas.height)
      //       feature = targetFeature
      //       console.log(targetFeature)
      //       if (!zoomOut) {
      //         mouseOver(targetFeature)
      //         zoomOut = true
      //         zoomIn = false
      //       }
      //     } else {
      //       console.log("移到外面2")
      //       // if (feature && feature.shape) {
      //       //   if (!zoomIn) {
      //       //     mouseOut(feature)
      //       //     zoomIn = true
      //       //     zoomOut = false
      //       //   }
      //       // }
      //     }
      //   }
      // })
      // 监听图层视野变化
      gMap.events.on('boundsChanged', (data) => {
        console.log('--map boundsChanged--', data)
        that.currentScale = that.gMap && that.gMap.getScale()
        that.currentCenter = that.gMap && that.gMap.getCenter()
        that.currentZoom = that.gMap && that.gMap.zoom
        return ''
      })
      // 监听图形双击编辑
      gMap.events.on('featureSelected', (feature) => {
        // console.log('--map featureSelected--', feature);
        gMap.setActiveFeature(feature)
        this.menuVisible = false
        // 增加删除按钮
        addDeleteIcon(gMap, feature, featureLayer, this.deleteUrl)
      })
      // 监听单击空白取消编辑
      gMap.events.on('featureUnselected', (feature) => {
        // this.setMode("PAN")
        this.gMap.setMode('BAN')
        gMap.setActiveFeature(null)
      })
      // 监听更新完
      gMap.events.on('featureUpdated', (feature, shape) => {
        // 更新或者移动需要重新设置删除图标
        feature.updateShape(shape)
        // 增加删除按钮
        addDeleteIcon(gMap, feature, featureLayer, this.deleteUrl)
      })
      // 删除
      gMap.events.on('FeatureDeleted', () => {
        // this.featureLayer.removeFeatureById(this.editId);
      })
    },
    drawImage(url, pointArr) {
      var that = this
      that.showClip = true
      console.log(url, pointArr)
      console.log(document.getElementById('imgDom'))
      var canvas = document.getElementById('imgDom')
      var ctx = canvas.getContext('2d')
      var img = new Image()
      img.crossOrigin = ''
      img.src = url
      console.log(that.firstPosition)
      console.log(that.firstScale)
      console.log(that.tempScale)
      // that.tempScale = that.gMap.getScale() / that.firstScale+ 0.005
      that.tempScale = that.gMap.getScale() / that.firstScale + 0.002
      // that.leftOrigin = '50%'
      // that.rightOrigin = '50%'
      // that.leftOrigin = (that.gMap.getCenter().x - that.firstPosition.x)*(-1)*1866/4398
      // that.rightOrigin = (that.gMap.getCenter().y - that.firstPosition.y)*(-1)*861/2933
      console.log('that.firstPosition.x0', that.firstPosition.x)
      console.log('that.firstPosition.y0', that.firstPosition.y)
      // that.firstPosition.x +=  that.gMap.getCenter().x - that.firstPosition.x
      // that.firstPosition.y +=  that.gMap.getCenter().y - that.firstPosition.y
      console.log('that.firstPosition.x1', that.firstPosition.x)
      console.log('that.firstPosition.y1', that.firstPosition.y)
      that.leftOrigin =
        (that.gMap.getCenter().x * that.gMap.getScale() -
          that.firstPosition.x * that.firstScale) *
        -1
      that.rightOrigin =
        (that.gMap.getCenter().y * that.gMap.getScale() -
          that.firstPosition.y * that.firstScale) *
        -1
      console.log(that.firstPosition, '*************1', that.gMap.getCenter())
      img.onload = function () {
        // console.log(this)
        // let el = document.getElementById("map")
        console.log(img.width, img.height)
        // alert(img.width)
        // alert(img.height)
        // 计算图片缩放比例
        var scaleFactor = Math.min(
          that.containerWidth / img.width,
          that.containerHeight / img.height
        )
        that.scaleFactor = scaleFactor
        if (
          img.width / img.height <
          that.containerWidth / that.containerHeight
        ) {
          //左右留白 改变left，高占满
          that.canvasContainerWidth = Math.round(
            img.width * (that.containerHeight / img.height)
          )
          that.canvasContainerHeight = that.containerHeight
          that.left = Math.round(
            (that.containerWidth - that.canvasContainerWidth) / 2
          )
          // that.left +=  that.gMap.getCenter().x - that.firstPosition.x
          that.top = 0
          // that.top +=  that.gMap.getCenter().y - that.firstPosition.y
          // that.left = Math.round((that.containerWidth - that.canvasContainerWidth) / 2) + that.leftOrigin + 'px'
          // that.top = that.rightOrigin + "px"
          canvas.width = that.canvasContainerWidth
          canvas.height = that.containerHeight
          // ctx.clearRect(0, 0, canvas.width, canvas.height)
          // ctx.drawImage(img, 0, 0, that.canvasContainerWidth, that.containerHeight)
          const tempCanvas = document.getElementById('tempCanvas')
          tempCanvas.width = that.canvasContainerWidth
          tempCanvas.height = that.containerHeight
          const tempCtx = tempCanvas.getContext('2d')
          // 将三角形坐标按比例映射到缩小后的图片上
          const mappedCoords = pointArr.map((coord) => [
            coord[0] * scaleFactor,
            coord[1] * scaleFactor,
          ])
          // 开始路径绘制
          tempCtx.beginPath()
          tempCtx.moveTo(mappedCoords[0][0], mappedCoords[0][1])
          for (let i = 1; i < mappedCoords.length; i++) {
            tempCtx.lineTo(mappedCoords[i][0], mappedCoords[i][1])
          }
          tempCtx.closePath()

          // 进行裁剪
          tempCtx.clip()

          // 在Canvas上绘制裁剪后的区域
          tempCtx.drawImage(
            img,
            0,
            0,
            that.canvasContainerWidth,
            that.containerHeight
          )
        } else {
          //上下留白 改变top，宽占满
          that.canvasContainerWidth = that.containerWidth
          that.canvasContainerHeight = Math.round(
            img.height * (that.containerWidth / img.width)
          )
          that.left = 0
          that.top = Math.round(
            (that.containerHeight - that.canvasContainerHeight) / 2
          )
          canvas.width = that.containerWidth
          canvas.height = that.canvasContainerHeight
          // ctx.clearRect(0, 0, canvas.width, canvas.height)
          // ctx.drawImage(img, 0, 0, that.containerWidth, that.canvasContainerHeight)
          const tempCanvas = document.getElementById('tempCanvas')
          tempCanvas.width = that.containerWidth
          tempCanvas.height = that.canvasContainerHeight
          const tempCtx = tempCanvas.getContext('2d')
          // 将三角形坐标按比例映射到缩小后的图片上
          const mappedCoords = pointArr.map((coord) => [
            coord[0] * scaleFactor,
            coord[1] * scaleFactor,
          ])
          // 开始路径绘制
          tempCtx.beginPath()
          tempCtx.moveTo(mappedCoords[0][0], mappedCoords[0][1])
          for (let i = 1; i < mappedCoords.length; i++) {
            tempCtx.lineTo(mappedCoords[i][0], mappedCoords[i][1])
          }
          tempCtx.closePath()

          // 进行裁剪
          tempCtx.clip()

          // 在Canvas上绘制裁剪后的区域
          tempCtx.drawImage(
            img,
            0,
            0,
            that.containerWidth,
            that.canvasContainerHeight
          )
        }
      }
    },
    drawCircle(url, x, y, r) {
      var that = this
      that.showClip = true
      var canvas = document.getElementById('imgDom')
      var ctx = canvas.getContext('2d')
      var img = new Image()
      img.crossOrigin = ''
      img.src = url
      that.tempScale = that.gMap.getScale() / that.firstScale + 0.002
      that.leftOrigin =
        (that.gMap.getCenter().x * that.gMap.getScale() -
          that.firstPosition.x * that.firstScale) *
        -1
      that.rightOrigin =
        (that.gMap.getCenter().y * that.gMap.getScale() -
          that.firstPosition.y * that.firstScale) *
        -1

      // 圆圈
      // img.onload = function () {
      //   // alert(img.width)
      //   // alert(img.height)
      //   let el = document.getElementById("map")
      //   console.log(img.width, img.height)
      //   console.log(el.offsetHeight, el.offsetWidth)
      //   let containerHeight = el.offsetHeight
      //   let containerWidth = el.offsetWidth
      //   var diameter = r * 2
      //   // 创建一个用于存放截取后圆形区域的 Canvas
      //   var circleCanvas = document.createElement('canvas')
      //   var circleCtx = circleCanvas.getContext('2d')
      //   circleCanvas.width = diameter
      //   circleCanvas.height = diameter

      //   // 绘制圆形区域到 circleCanvas
      //   circleCtx.beginPath()
      //   circleCtx.arc(r, r, r, 0, 2 * Math.PI)
      //   circleCtx.closePath()
      //   circleCtx.clip()
      //   circleCtx.drawImage(img, x - r, y - r, diameter, diameter, 0, 0, diameter, diameter)

      //   // 创建一个用于存放放大后的圆形图像的 Canvas
      //   var magnifiedCanvas = document.createElement('canvas')
      //   var magnifiedCtx = magnifiedCanvas.getContext('2d')
      //   var scaleFactor = 1.06 // 根据需要调整放大倍数

      //   magnifiedCanvas.width = diameter * scaleFactor
      //   magnifiedCanvas.height = diameter * scaleFactor

      //   // 绘制放大后的圆形图像到 magnifiedCanvas
      //   magnifiedCtx.drawImage(circleCanvas, 0, 0, diameter, diameter, 0, 0, diameter * scaleFactor, diameter * scaleFactor)

      //   // 设置原始 Canvas 尺寸和绘制原始图像
      //   canvas.width = img.width
      //   canvas.height = img.height
      //   // ctx.drawImage(img, 0, 0)

      //   // 叠加放大后的圆形图像到原图像上
      //   // ctx.drawImage(magnifiedCanvas, x - r * scaleFactor - 50 * that.currentScale, y - r * scaleFactor)
      //   if ((containerWidth / containerHeight) < (img.width / img.height)) {
      //     ctx.drawImage(magnifiedCanvas, x - r * scaleFactor - ((img.width * containerHeight / img.height - containerWidth) * 0.5 * 0.5), y - r * scaleFactor)
      //   } else {
      //     ctx.drawImage(magnifiedCanvas, x - r * scaleFactor, y - r * scaleFactor - ((img.height * containerWidth / img.height - containerHeight) * 0.5 * 0.5))
      //   }
      //   that.showClip = true
      // }

      // 圆形
      img.onload = function () {
        // console.log(this)
        // let el = document.getElementById("map")
        console.log(img.width, img.height)
        // alert(img.width)
        // alert(img.height)
        // 计算图片缩放比例
        var scaleFactor = Math.min(
          that.containerWidth / img.width,
          that.containerHeight / img.height
        )
        that.scaleFactor = scaleFactor
        if (
          img.width / img.height <
          that.containerWidth / that.containerHeight
        ) {
          //左右留白 改变left，高占满
          that.canvasContainerWidth = Math.round(
            img.width * (that.containerHeight / img.height)
          )
          that.canvasContainerHeight = that.containerHeight
          that.left = Math.round(
            (that.containerWidth - that.canvasContainerWidth) / 2
          )
          that.top = 0
          canvas.width = that.canvasContainerWidth
          canvas.height = that.containerHeight
          const tempCanvas = document.getElementById('tempCanvas')
          tempCanvas.width = that.canvasContainerWidth
          tempCanvas.height = that.containerHeight
          const tempCtx = tempCanvas.getContext('2d')
          var scaledX = x * scaleFactor
          var scaledY = y * scaleFactor
          var scaledR = r * scaleFactor
          // 开始路径绘制
          tempCtx.beginPath()
          tempCtx.arc(scaledX, scaledY, scaledR, 0, 2 * Math.PI)
          tempCtx.closePath()
          tempCtx.clip()
          // 在Canvas上绘制裁剪后的区域
          tempCtx.drawImage(
            img,
            0,
            0,
            that.canvasContainerWidth,
            that.containerHeight
          )
        } else {
          //上下留白 改变top，宽占满
          that.canvasContainerWidth = that.containerWidth
          that.canvasContainerHeight = Math.round(
            img.height * (that.containerWidth / img.width)
          )
          that.left = 0
          that.top = Math.round(
            (that.containerHeight - that.canvasContainerHeight) / 2
          )
          canvas.width = that.containerWidth
          canvas.height = that.canvasContainerHeight
          // ctx.clearRect(0, 0, canvas.width, canvas.height)
          // ctx.drawImage(img, 0, 0, that.containerWidth, that.canvasContainerHeight)
          const tempCanvas = document.getElementById('tempCanvas')
          tempCanvas.width = that.containerWidth
          tempCanvas.height = that.canvasContainerHeight
          const tempCtx = tempCanvas.getContext('2d')
          var scaledX = x * scaleFactor
          var scaledY = y * scaleFactor
          var scaledR = r * scaleFactor
          // 开始路径绘制
          tempCtx.beginPath()
          tempCtx.arc(scaledX, scaledY, scaledR, 0, 2 * Math.PI)
          tempCtx.closePath()
          tempCtx.clip()
          // 在Canvas上绘制裁剪后的区域
          tempCtx.drawImage(
            img,
            0,
            0,
            that.containerWidth,
            that.canvasContainerHeight
          )
        }
      }
    },
    fetchTopMap() {
      var that = this
      getTopMap().then((res) => {
        var img = new Image()
        img.crossOrigin = ''
        that.topMapData = res.data
        that.imgUrl = res.data.picUrl
        // that.imgUrl = 'http://192.168.1.175:8090' + res.data.picUrl
        img.src = that.imgUrl
        img.onload = function () {
          that.containerWidth = that.$refs.container.offsetWidth
          that.containerHeight = that.$refs.container.offsetHeight
          var scaleFactor = Math.min(
            that.containerWidth / img.width,
            that.containerHeight / img.height
          )
          that.scaleFactor = scaleFactor
          that.picWidth = img.width
          that.picHeight = img.height
          if (
            img.width / img.height <
            that.containerWidth / that.containerHeight
          ) {
            //左右留白 改变left，高占满
            that.canvasContainerWidth = Math.round(
              img.width * (that.containerHeight / img.height)
            )
            that.canvasContainerHeight = that.containerHeight
            that.left =
              Math.round(
                (that.containerWidth - that.canvasContainerWidth) / 2
              ) + 'px'
            that.top = '0px'
            // that.initMap()
          } else {
            //上下留白 改变top，宽占满
            that.canvasContainerWidth = that.containerWidth
            that.canvasContainerHeight = Math.round(
              img.height * (that.containerWidth / img.width)
            )
            that.left = '0px'
            that.top =
              Math.round(
                (that.containerHeight - that.canvasContainerHeight) / 2
              ) + 'px'
            // that.initMap()
          }
          that.operateList.push(res.data)
          console.log('that.operateList存')
          sessionStorage.setItem('mapHistory', JSON.stringify(that.operateList))
          console.log('*******顶级地图********', res.data.id, res.data)
          that.initMap(res.data.id, res.data)
          // that.initMap("36d57eb0ea03eb60a92dfcadb53c316d",
          //   {
          //     id: "36d57eb0ea03eb60a92dfcadb53c316d",
          //     createTime: "2024-03-06 18:06:51",
          //     updateTime: "2024-03-06 18:06:51",
          //     indexCode: null,
          //     regionId: "049c8a8a7962529eeb2dc9836ad70844",
          //     name: "园区-全景图",
          //     type: 1,
          //     floorNo: 1,
          //     fileServerUrl: null,
          //     showLine: false,
          //     picUrl: "/images/map/全景图_1709719609940.jpg",
          //     thumbnailUrl: "/images/map/全景图_1709719609940.jpg",
          //     imageBase64: null,
          //     longitude: null,
          //     latitude: null,
          //     elevation: null,
          //     sort: 1,
          //     x: 0,
          //     y: 0,
          //     z: 0,
          //     extension: null,
          //     deleteFlag: "0",
          //     labels: null
          //   })
        }
      })
    },
    videoClose() {
      this.cameraVisible = false
      this.cameraObj = {}
      this.flvPlayer.pause()
      this.flvPlayer.unload()
      this.flvPlayer.detachMediaElement()
      this.flvPlayer.destroy()
      this.flvPlayer = null
    },
    doorClose() {
      this.doorVisible = false
    },
    defenceClose() {
      this.defenceVisible = false
    },
    goToLine() {
      console.log(this.tempList1)
      var that = this
      if (that.tempList1[0].type == 4) {
        function findChildrenById(tree, parentId) {
          for (let node of tree) {
            if (node.id === parentId) {
              return node.children || []
            }
            if (node.children && node.children.length > 0) {
              const foundChildren = findChildrenById(node.children, parentId)
              if (foundChildren.length > 0) {
                return foundChildren
              }
            }
          }
          return []
        }
        const childrenData = findChildrenById(
          that.lineTreeData,
          that.tempList1[0].regionId
        )
        console.log(childrenData)
        function makeRequestsSequentially(index, children) {
          if (index >= children.length) {
            // 所有请求完成
            return
          }
          let data = {
            regionId: children[index].id,
            current: 1,
            size: -1,
            name: '',
            flag: false,
            type: '',
          }
          getMapByPage(data).then((res777) => {
            // 处理当前请求结果
            // 调用下一个请求
            if (res777.data.records.length == 0) {
              makeRequestsSequentially(index + 1, children)
            } else {
              function customSort(a, b) {
                if (a.type === b.type) {
                  return a.sort - b.sort
                } else {
                  return a.type - b.type
                }
              }
              let resultList = res777.data.records
                .filter((it) => it.deleteFlag == '0')
                .sort(customSort)
              var toggleAllFloorList = resultList
              sessionStorage.setItem(
                'toggleAllFloorList',
                JSON.stringify(toggleAllFloorList)
              )
              // alert(7)
              that.toggleAllFloorList = toggleAllFloorList //修复bug
              that.$router.push({
                path: '/comprehensive-control/mapIndex',
                query: {
                  id: resultList[0].id,
                  isJump: that.$route.query.isJump,
                },
              })
              return
            }
          })
        }
        if (childrenData.length > 0) {
          makeRequestsSequentially(0, childrenData)
        }
      }
    },
    goToVehicle() {
      var that = this
      if (this.tempList1[0].type == 4) {
        return
      }
      var tempList = that.mapList.filter(
        (its) =>
          its.type == 4 &&
          its.deleteFlag === '0' &&
          its.regionId === that.lineId
      )
      console.log(tempList)
      if (tempList.length == 0) {
        that.$message.error('暂未配置车载图！')
        return
      }
      function customSort(a, b) {
        if (a.type === b.type) {
          return a.sort - b.sort
        } else {
          return a.type - b.type
        }
      }
      var resultList = tempList.sort(customSort)
      that.$router.push({
        path: '/comprehensive-control/mapIndex',
        query: {
          id: resultList[0].id,
          isJump: that.$route.query.isJump,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}

// .back {
//   position: absolute;
//   right: 20px;
//   top: 15px;
//   z-index: 1000;
// }

.rightMenu {
  position: absolute;
  z-index: 100;
  width: 120px;
  background: #000;
  color: #fff;
  border-radius: 3px;
  ul {
    margin: 0;
    padding: 10px 0;
    li {
      line-height: 30px;
      cursor: pointer;
      padding: 0 10px;
      i {
        margin-right: 5px;
      }
    }
  }
  li:hover {
    background: #6495ed;
    color: #fff;
  }
}

.button-wrap {
  padding-bottom: 10px;
  position: relative;
  z-index: 99;
  display: flex;
  justify-content: center;
  width: 100%;
}

#map01,
#vr01 {
  // overflow: hidden;
  position: relative;
  height: 100%;
  // background-color: var(--back-black);
  // z-index: 95;

  #right-top-btn {
    width: 26px;
    position: absolute;
    right: 40px;
    top: 0;
    z-index: 999;
    // transform: scale(0.25);
    // transform-origin: right top;

    .resize {
      z-index: 1000;
      font-size: 24px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      width: 26px;
      height: 26px;
      background-image: url('../../../assets/images/resize.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .model {
      z-index: 1000;
      font-size: 24px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      width: 26px;
      height: 26px;
      background-image: url('../../../assets/images/back.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .hide-name {
      z-index: 1000;
      font-size: 24px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      width: 26px;
      height: 26px;
    }

    .hide-eye {
      background-image: url('../../../assets/images/eye.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .show-eye {
      background-image: url('../../../assets/images/eye-close.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .select {
      z-index: 1000;
      font-size: 24px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      width: 26px;
      height: 26px;
      background-image: url('../../../assets/images/select1.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .back {
      z-index: 1000;
      font-size: 24px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      width: 26px;
      height: 26px;
      background-image: url('../../../assets/images/back.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}

#vr01 .thumb-box {
  position: absolute;
  top: 20px;
  right: 66px;
  // z-index: 9998;
  // background-color: rgba(0, 0, 0, 0.6);
  background-color: rgba(2, 15, 24, 0.62);
  // transform: scale(0.25);
  // transform-origin: right top;

  .thumb-img {
    max-width: 250px; /* 图片的最大宽度 */
    max-height: 250px; /* 图片的最大高度 */
    object-fit: contain; /* 保持图片比例，充满容器 */
  }

  .rotate-contaienr {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    .thumb-point {
      width: 20px;
      height: 20px;
      position: absolute;
    }
    .marker-point {
      width: 16px;
      height: 16px;
      position: absolute;
      cursor: pointer;
    }
  }
}

#cesium01 {
  // position: absolute;
  // left: 0;
  // top: 0;
  // height: 100%;
  // width: 100%;
  // z-index: 90;
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
  top: -100%;
  z-index: 90;
}
.zoom-icon-wrapper {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1000;
}

.zoom-icon-plus {
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-plus:hover {
  border-color: #4169e1;
}

.zoom-icon-minus {
  margin-top: 6px;
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-minus:hover {
  border-color: #4169e1;
}

.fade-enter-active,
.fade-leave-active {
  width: 180px;
  transition: all 1s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#imgDom {
  // transform: scale(1414/1920);
  // transform-origin: center center;
  // background-color: transparent;
  // pointer-events: none;
  // filter: drop-shadow(10px 10px 20px rgba(255, 0, 0, 0.8));
  // transform: scale(1.01);
  // transform-origin: center center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 103 !important;
}

#tempCanvas {
  position: absolute;
  // z-index: 99;
  left: 0;
  top: 0;
  z-index: -1 !important;
  // transform: scale(1.008);
  // transform-origin: center center;
  // transform-origin: center center;
}

#myCanvas {
  position: absolute;
  z-index: 100;
  left: 0;
  top: 0;
  z-index: 101 !important;
  // z-index: 95 !important;
  // transform: scale(1.008);
  // transform-origin: center center;
  // transform-origin: center center;
}

// .imgDom:hover {
// cursor: pointer;
// transform: scale(1.01);
// transform-origin: center center;
/* filter: drop-shadow(10px 10px 40px red);   */
// filter: drop-shadow(10px 10px 20px rgba(255, 0, 0, 0.8));
// }

.ripple {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 300;
  pointer-events: none;
  // border: 2px solid blue;
  // z-index: 9999;
  // border-radius: 50%;
  // background-color: #ff0000;
  // animation: ripple 1.5s infinite;
  // opacity: 0;
  .inner-ripple {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: relative;
    left: -25px;
    top: 0px;
    background-color: #ff0000;
    animation: ripple 2s infinite;
    opacity: 0;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  10% {
    transform: scale(0.1);
    opacity: 0.1;
  }
  20% {
    transform: scale(0.2);
    opacity: 0.3;
  }
  30% {
    transform: scale(0.3);
    opacity: 0.5;
  }
  40% {
    transform: scale(0.4);
    opacity: 0.6;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  60% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  70% {
    transform: scale(0.7);
    opacity: 0.3;
  }
  80% {
    transform: scale(0.8);
    opacity: 0.2;
  }
  90% {
    transform: scale(0.9);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.noTitleDailog {
  .video-container {
    width: 100%;
    height: 100%;
    position: relative;

    .close {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 20px;
      right: 20px;
      cursor: pointer;
      color: #fff;
      font-size: 28px;
    }
  }

  ::v-deep .el-dialog__header {
    display: none;
  }

  ::v-deep .el-dialog__body {
    padding: 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
}

.doorDailog {
  ::v-deep .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
  }
  ::v-deep .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  ::v-deep .el-dialog__header {
    display: none;
  }

  ::v-deep .el-dialog__body {
    padding: 12px 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;

    background: #202020;
    border-radius: 4px;
  }

  .control {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;

    flex-direction: column;
    align-items: center;
  }
  .door-close {
    position: absolute;
    width: 30px;
    height: 30px;
    top: -15px;
    right: -15px;
    cursor: pointer;
    img {
      width: 30px;
      height: 30px;
    }
    &:hover {
      content: url(../../../assets/images/icon/close-hover.png);
    }
  }
}

//左侧面板
.panel-left-container {
  position: absolute;
  // height: calc(100% - 100px);
  height: 100%;
  width: 500px;
  left: 0;
  // margin-top: 50px;
  .left {
    position: absolute;
    width: 400px;
    top: 0px;
    left: 0px;
    bottom: 0px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 0 0 5px;
    background: -webkit-linear-gradient(
      right,
      rgba(2, 15, 24, 0.8),
      rgba(2, 15, 24, 0.55)
    );

    .top-bar {
      width: 100%;
      padding: 0 20px;
      // background-color: #fff;
      display: flex;
      justify-content: space-between;

      .top-box {
        width: calc(100% - 60);
        height: 30px;
        display: flex;
        // margin-top: 15px;

        .top-box-item {
          width: 100px;
          height: 30px;
          border-radius: 2px;
          line-height: 30px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
          text-align: center;
        }

        .is-active {
          // background: linear-gradient(180deg, rgba(40, 111, 155, 0) 0%, rgba(11, 170, 170, 0.83) 100%);
          background: linear-gradient(
            0deg,
            rgba(11, 170, 170, 0.83) 0%,
            rgba(40, 111, 155, 0) 80%
          );
        }
      }

      .detail-button {
        width: 60px;
        height: 30px;
        // margin: 15px 0 0 0;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        img {
          width: 22px;
          height: 22px;
          margin-left: 15px;
        }
      }
    }
  }
  .isShow1 {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    right: 10px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
    }

    animation: toRight1 2s infinite;
  }

  .isShowOne1 {
    position: absolute;
    width: 30px;
    height: 30px;
    top: calc(50% + 5px);
    right: 5px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }

    animation: toRightOne1 2s infinite;
  }

  .disShow1 {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    left: 50px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
    }

    animation: toLeft1 2s infinite;
  }

  .disShowOne1 {
    position: absolute;
    width: 30px;
    height: 30px;
    top: calc(50% + 5px);
    left: 45px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }

    animation: toLeftOne1 2s infinite;
  }
  @keyframes toRight1 {
    0% {
      opacity: 0;
      left: 450px;
    }

    100% {
      opacity: 1;
      left: 410px;
    }
  }

  @keyframes toRightOne1 {
    0% {
      opacity: 0;
      left: 470px;
    }

    100% {
      opacity: 1;
      left: 430px;
    }
  }

  @keyframes toLeft1 {
    0% {
      opacity: 0;
      left: 10px;
    }

    100% {
      opacity: 1;
      left: 50px;
    }
  }

  @keyframes toLeftOne1 {
    0% {
      opacity: 0;
      left: 2px;
    }

    100% {
      opacity: 1;
      left: 42px;
    }
  }
}
// 左侧面板

.panel-right-container {
  position: absolute;
  // height: calc(100% - 100px);
  height: 100%;
  width: 500px;
  right: 0;
  // margin-top: 50px;
  .right {
    position: absolute;
    width: 400px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 0 0 5px;
    background: -webkit-linear-gradient(
      right,
      rgba(2, 15, 24, 0.8),
      rgba(2, 15, 24, 0.55)
    );

    .top-bar {
      width: 100%;
      padding: 0 20px;
      // background-color: #fff;
      display: flex;
      justify-content: space-between;

      .top-box {
        width: calc(100% - 60);
        height: 30px;
        display: flex;
        // margin-top: 15px;

        .top-box-item {
          width: 100px;
          height: 30px;
          border-radius: 2px;
          line-height: 30px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
          text-align: center;
        }

        .is-active {
          // background: linear-gradient(180deg, rgba(40, 111, 155, 0) 0%, rgba(11, 170, 170, 0.83) 100%);
          background: linear-gradient(
            0deg,
            rgba(11, 170, 170, 0.83) 0%,
            rgba(40, 111, 155, 0) 80%
          );
        }
      }

      .detail-button {
        width: 60px;
        height: 30px;
        // margin: 15px 0 0 0;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        img {
          width: 22px;
          height: 22px;
          margin-left: 15px;
        }
      }
    }
  }
  .isShow {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    right: 10px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
    }

    animation: toRight 2s infinite;
  }

  .isShowOne {
    position: absolute;
    width: 30px;
    height: 30px;
    top: calc(50% + 5px);
    right: 5px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }

    animation: toRightOne 2s infinite;
  }

  .disShow {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    right: 50px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
    }

    animation: toLeft 2s infinite;
  }

  .disShowOne {
    position: absolute;
    width: 30px;
    height: 30px;
    top: calc(50% + 5px);
    right: 45px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }

    animation: toLeftOne 2s infinite;
  }
  @keyframes toRight {
    0% {
      opacity: 0;
      right: 450px;
    }

    100% {
      opacity: 1;
      right: 410px;
    }
  }

  @keyframes toRightOne {
    0% {
      opacity: 0;
      right: 470px;
    }

    100% {
      opacity: 1;
      right: 430px;
    }
  }

  @keyframes toLeft {
    0% {
      opacity: 0;
      right: 10px;
    }

    100% {
      opacity: 1;
      right: 50px;
    }
  }

  @keyframes toLeftOne {
    0% {
      opacity: 0;
      right: 0;
    }

    100% {
      opacity: 1;
      right: 40px;
    }
  }
}

.show-data {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  z-index: 9999;

  background: #000000;
  opacity: 0.9;

  .top-bar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    height: 54px;
    margin: 5px 0;
    padding: 0 10px;

    .detail-button {
      width: 60px;
      height: 30px;
      margin: auto 0;
      line-height: 30px;
      text-align: center;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .content {
    display: flex;
    width: 100%;
    height: calc(100% - 64px);
    padding: 0 10px;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    overflow: auto;

    .item {
      width: 25%;
      height: 300px;
      margin: 15px 20px;
    }
  }
}

#button-container {
  width: 150px;
  height: 50px;
  position: absolute;
  bottom: 160px;
  right: 0;
  z-index: 999;
  background-color: rgba(2, 15, 24, 0.62);
  display: flex;
  align-items: center;
  justify-content: center;
}

#station-container {
  width: 100%;
  height: 65px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 100;
  // background-color: white;
  background-color: rgba(2, 15, 24, 0.62);
  overflow: hidden;
  white-space: nowrap; /* 防止内容换行 */

  .station-wrapper {
    display: flex;
    // align-items: center;
    // justify-content: center;
    justify-content: flex-start;
    height: 30px;
    // border: 1px solid blue;
    margin-top: 15px;

    .loop-container {
      // background-color: yellow;
      display: flex;
      align-items: center;
      .circle {
        width: 15px;
        height: 15px;
        position: relative;
        color: #ffffff;
        font-size: 12px;
        // cursor: pointer;

        .circle-station {
          width: 15px;
          height: 15px;
          line-height: 15px;
          border-radius: 50%;
          background-color: green;
          border: 1px solid #cccccc;
          position: absolute;
          left: 0;
          top: 0;
          color: #ffffff;
          font-size: 12px;
          cursor: pointer;

          &:hover {
            width: 21px !important;
            height: 21px !important;
            position: absolute !important;
            top: -3px !important;
            border: 1px solid white !important;
          }
        }
        .station-odd {
          position: absolute;
          left: 50%;
          top: 15px;
          height: 30px;
          line-height: 30px;
          // cursor: pointer;
          transform: translateX(-50%);
          width: 120px;
          text-align: center;
          span {
            cursor: pointer;
            // border: 2px solid blue;
          }
        }

        .station-even {
          position: absolute;
          left: 50%;
          top: -30px;
          height: 30px;
          line-height: 30px;
          // cursor: pointer;
          transform: translateX(-50%);
          width: 120px;
          text-align: center;

          span {
            cursor: pointer;
            // border: 1px solid red;
          }
        }
      }

      .circle-first {
        margin-left: 60px;
      }
      .line {
        width: 30px;
        height: 2px;
        // background-color: #666666;
        background-color: #ffffff;
      }
    }
  }
}

#page-contaienr {
  width: 100%;
  // height: 60px;
  position: absolute;
  left: 0;
  // transform: translateX(-50%);
  // bottom: 65px;
  z-index: 999;
  color: #fff;
  overflow: hidden;
  height: 110px;
}

.active-circle {
  background-color: #ffa500 !important;
  width: 21px !important;
  height: 21px !important;
  position: absolute !important;
  top: -3px !important;
  border: 1px solid white !important;
}

.active-gray {
  background-color: #cccccc !important;
}
.active-font {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #ffa500 !important;
}

.custom-tooltip {
  position: relative;
  display: inline-block;
  // &:hover {
  //   .tooltip-content {
  //     display: block;
  //     position: absolute;
  //     top: 0; /* 调整垂直位置 */
  //     left: 15px; /* 居中水平位置 */
  //     background-color: #ffffff;
  //     width: auto; /* 自适应宽度 */
  //     max-width: none; /* 移除最大宽度限制 */
  //     white-space: nowrap; /* 防止文本换行 */
  //     height: 23px;
  //     line-height: 23px;
  //     font-size: 12px;
  //     padding: 0 5px;
  //     color: #000;
  //     z-index: 999;
  //   }
  // }
}

.tooltip-content {
  display: none;
}

.tips-container {
  width: 940px;
  // max-height: 630px;
  // overflow-y: auto;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  // transform: translateX(-50%) scale(0.25);
  // transform-origin: center top;
  z-index: 999;
  color: red;
  // color: #b42e04;
  font-size: 12px;
  box-shadow: inset 0 0 15px 10px rgba(180, 0, 0, 0.4); /* 设置阴影样式 */
  background-color: rgba(0, 0, 0, 0.85);
  // background: linear-gradient(
  //     to right,
  //     rgba(100, 0, 0, 0.5) 0%,
  //     rgba(100, 0, 0, 0.4) 1%,
  //     rgba(0, 0, 0, 1) 50%,
  //     rgba(100, 0, 0, 0.4) 99%,
  //     rgba(100, 0, 0, 0.5) 100%
  //   ),
  //   linear-gradient(
  //     to bottom,
  //     rgba(100, 0, 0, 0.5) 0%,
  //     rgba(100, 0, 0, 0.4) 1%,
  //     rgba(0, 0, 0, 1) 50%,
  //     rgba(100, 0, 0, 0.4) 99%,
  //     rgba(100, 0, 0, 0.5) 100%
  //   );
  // background-image: url("../../../assets/images/shadowBorderUp.png");
  // background-size: cover;
  // background-position: center center;
  // background-repeat: no-repeat;
  // border-radius: 5px;

  .tips-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
    height: 36px;
    margin-bottom: 6px;
    color: #ffffff;
    cursor: pointer;
    span {
      font-size: 14px;
      margin-right: 6px;
    }
    i {
      margin-left: 10px;
      // color: #ffffff;
      font-size: 18px;
    }
  }

  .tips-loop {
    max-height: 770px;
    overflow-y: auto;
    .tips-item {
      display: flex;
      align-items: center;
      margin-top: 12px;
      user-select: none;
      // border:1px solid yellow;
    }
    .tips-item:last-child {
      margin-bottom: 12px;
    }
  }
}

// .search {
//   position: absolute;
//   left: 20px;
//   top: 15px;
//   z-index: 1000;
//   ::v-deep .el-autocomplete-suggestion {
//     background-color: rgba(255, 255, 255, 0.82) !important;
//   }
//   ::v-deep .el-input .el-input__inner {
//     background-color: #fff;
//     border-color: var(--alarm-page);
//     color: var(--normal-black);
//     cursor: pointer;
//   }
// }

.bg-yellow {
  background-color: #ffff00; /* 黄色背景 */
  border: 1px solid #ffff00;
  border-radius: 50%;
}

.my-image-viewer ::v-deep .el-icon-circle-close {
  color: #fff;
}

// .map-name {
//   height: 20px;
//   color: #fff;
//   line-height: 20px;
//   font-size: 12px;
// }

.scroll-wrap {
  // max-width: calc(100% - 50px);
  overflow-x: auto;
  overflow-y: hidden;
  /* 隐藏滚动条 */
  // scrollbar-width: none; /* Firefox */
  // -ms-overflow-style: none; /* IE 10+ */

  // ::-webkit-scrollbar {
  //   display: none;
  // }
}

.map-picture {
  width: 116px;
  height: 90px;
  margin: 5px;
  object-fit: cover;
}

.map-picture-unselected {
  border: 2px solid #cccccc;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    border: 2px solid #ffffff;
    opacity: 1;
  }
  &:hover ~ .vr-play-unselect {
    border: 2px solid #ffffff;
    cursor: pointer;
    opacity: 1;
  }
}

.vr-play-select {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -16px;
  margin-left: -16px;
  width: 32px;
  height: 32px;
  background-image: url(../../../assets/images/icon-vr.png);
  background-color: rgba(0, 0, 0, 0.35);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  pointer-events: none;
}

.vr-play-unselect {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -16px;
  margin-left: -16px;
  width: 32px;
  height: 32px;
  background-image: url(../../../assets/images/icon-vr.png);
  background-color: rgba(0, 0, 0, 0.35);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  border-radius: 50%;
  border: 2px solid #cccccc;
  box-sizing: border-box;
  pointer-events: none;
  opacity: 0.5;
}

.left-arrow {
  width: 25px;
  cursor: pointer;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 2px solid #cccccc;
  opacity: 0.5;
  &:hover {
    // border: 2px solid #ffffff;
    opacity: 1;
  }
  &:hover {
    .el-icon-arrow-left {
      color: #ffffff !important;
    }
  }
}

.right-arrow {
  width: 25px;
  margin-left: 5px;
  cursor: pointer;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 2px solid #cccccc;
  opacity: 0.5;
  &:hover {
    // border: 2px solid #ffffff;
    opacity: 1;
  }
  &:hover {
    .el-icon-arrow-right {
      color: #ffffff !important;
    }
  }
}

.map-name {
  width: 100%;
  // height: 60px;
  position: absolute;
  left: 0;
  // transform: translateX(-50%);
  // bottom: 65px;
  z-index: 999;
  color: #fff;
  height: 30px;
}
</style>
