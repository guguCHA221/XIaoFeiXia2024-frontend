<template>
  <el-container class="app-container">
    <el-aside v-if="!isMobile" width="200px">
      <SideBar />
    </el-aside>
    <el-container>
      <el-header :height="isMobile ? '50px' : '60px'">
        <Header :isMobile="isMobile" @toggle-sidebar="toggleSidebar" />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-drawer
      v-if="isMobile"
      v-model="sidebarVisible"
      direction="ltr"
      size="200px"
    >
      <SideBar />
    </el-drawer>
  </el-container>
  <div v-if="isMobile" class="floating-button" @click="toggleSidebar">
    <el-button type="primary" circle>
      <el-icon><Menu /></el-icon>
    </el-button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import Header from '@/components/Header.vue'
import { Menu } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    SideBar,
    Header,
    Menu
  },
  setup() {
    const isMobile = ref(false)
    const sidebarVisible = ref(false)

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value
    }

    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      isMobile,
      sidebarVisible,
      toggleSidebar
    }
  }
}
</script>

<style scoped>
.app-container {
  height: 90vh;
}

.el-header {
  padding: 0;
  display: flex;
  align-items: center;
}

.el-main {
  padding: 20px;
  overflow-x: hidden;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

@media (max-width: 768px) {
  .el-main {
    padding: 10px;
  }
}
</style>
