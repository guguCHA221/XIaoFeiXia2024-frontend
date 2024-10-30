<template>
    <el-menu :default-active="activeIndex" :default-openeds="defaultOpeneds" class="el-menu-vertical-demo"
        @select="handleSelect" :collapse="isCollapse">
        <template v-if="isLoggedIn">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <operation />
                    </el-icon>
                    <span>功能模块</span>
                </template>
                <el-menu-item index="/lost-and-found">失物招领</el-menu-item>
                <el-menu-item index="/suit-rental">西服租赁</el-menu-item>
                <el-menu-item v-if="isAdmin" index="/user-management">账号管理</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon>
                        <user />
                    </el-icon>
                    <span>用户模块</span>
                </template>
                <el-menu-item index="/user-settings">用户设置</el-menu-item>
                <el-menu-item @click="logout">注销账号</el-menu-item>
            </el-sub-menu>
        </template>
        <template v-else>
            <el-menu-item index="/login">
                <el-icon>
                    <user />
                </el-icon>
                <span>登录</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Operation, User } from '@element-plus/icons-vue'

export default {
    name: 'SideBar',
    components: {
        Operation,
        User
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const activeIndex = ref('1')
        const isCollapse = ref(false)
        const defaultOpeneds = ref(['1', '2'])

        const isAdmin = computed(() => store.getters['auth/isAdmin'])
        const isLoggedIn = computed(() => store.getters['auth/isAuthenticated'])

        const handleSelect = (key, keyPath) => {
            router.push(key)
        }

        const logout = () => {
            store.dispatch('auth/logout')
            router.push('/login')
        }

        return {
            activeIndex,
            isCollapse,
            isAdmin,
            isLoggedIn,
            handleSelect,
            logout,
            defaultOpeneds
        }
    }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
