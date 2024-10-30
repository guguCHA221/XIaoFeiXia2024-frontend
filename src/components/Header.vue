<template>
  <div class="header">
    <div class="left-section">
      <el-button v-if="isMobile" class="menu-button" @click="$emit('toggle-sidebar')">
        <el-icon><Menu /></el-icon>
      </el-button>
      <img src="@/assets/logo.png" alt="Logo" class="logo">
    </div>
    <h1 class="title">学生事务管理系统</h1>
  </div>
</template>

<script>
import { Menu } from '@element-plus/icons-vue'

export default {
  name: 'Header',
  components: {
    Menu
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup() {
    // 如果需要添加其他逻辑，可以在这里添加
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.left-section {
  display: flex;
  align-items: center;
}

.menu-button {
  margin-right: 15px;
  padding: 5px;
}

.logo {
  height: 40px;
  margin-right: 15px;
}

.title {
  font-size: 1.2rem;
  margin: 0;
}

@media (max-width: 768px) {
  .header {
    padding: 0 10px;
  }

  .logo {
    height: 30px;
  }

  .title {
    font-size: 1rem;
  }
}
</style>
