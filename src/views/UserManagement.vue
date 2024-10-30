<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <el-button type="primary" @click="showAddUsersDialog">批量添加用户</el-button>

    <el-table :data="users" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column label="管理员">
        <template #default="scope">
          <el-switch v-model="scope.row.is_admin" @change="updateUserStatus(scope.row, 'is_admin')"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template #default="scope">
          <el-switch v-model="scope.row.is_active" @change="updateUserStatus(scope.row, 'is_active')"></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="批量添加用户" v-model="addUsersDialogVisible" width="30%">
      <el-form :model="addUsersForm">
        <el-form-item label="用户名列表">
          <el-input type="textarea" v-model="addUsersForm.usernames" placeholder="请输入用户名,每行一个" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addUsersDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUsers">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UserManagement',
  data() {
    return {
      addUsersDialogVisible: false,
      addUsersForm: {
        usernames: '',
      },
    };
  },
  computed: {
    ...mapState('userManagement', ['users']),
  },
  methods: {
    ...mapActions('userManagement', ['fetchUsers', 'updateUser', 'addBatchUsers']),

    async updateUserStatus(user, field) {
      try {
        const response = await this.updateUser({ ...user, [field]: user[field] });
        if (response.status === 200) {
          this.$message.success('用户状态更新成功');
        } else {
          user[field] = !user[field];
          throw new Error('更新失败');
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          this.$message.error('权限不足，无法更新用户状态');
          user[field] = !user[field];
        } else {
          user[field] = !user[field];
          this.$message.error('用户状态更新失败');
        }
        console.error('Error updating user status:', error);
      }
    },

    showAddUsersDialog() {
      this.addUsersDialogVisible = true;
    },

    async addUsers() {
      try {
        const usernames = this.addUsersForm.usernames.split('\n').filter(username => username.trim() !== '');
        if (usernames.length === 0) {
          this.$message.warning('请输入至少一个用户名');
          return;
        }
        await this.addBatchUsers(usernames);
        this.$message.success('用户添加成功');
        this.addUsersDialogVisible = false;
        this.addUsersForm.usernames = '';
        this.fetchUsers(); // 刷新用户列表
      } catch (error) {
        this.$message.error('添加用户失败');
        console.error('Error adding users:', error);
      }
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
