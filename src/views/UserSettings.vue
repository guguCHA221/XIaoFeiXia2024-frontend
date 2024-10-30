<template>
  <div class="user-settings">
    <h2>用户设置</h2>
    <el-form :model="form" label-width="120px">
      <el-form-item label="账号名">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="form.confirmPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserSettings',
  setup() {
    const store = useStore()
    const router = useRouter()
    const form = reactive({
      username: store.state.auth.user,
      newPassword: '',
      confirmPassword: ''
    })

    const changePassword = async () => {
      if (form.newPassword !== form.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return
      }
      try {
        await store.dispatch('auth/changePassword', form.newPassword)
        ElMessage.success('密码修改成功，请重新登录')
        
        // 执行退出登录操作
        await store.dispatch('auth/logout')
        
        // 重定向到登录页面
        router.push('/login')
      } catch (error) {
        ElMessage.error('密码修改失败')
      }
    }

    return {
      form,
      changePassword
    }
  }
}
</script>
