<template>
  <div class="suit-rental">
    <h2 class="title">西服租赁管理</h2>

    <el-button type="primary" @click="showAddDialog" class="add-button">新增租赁</el-button>

    <div class="filters">
      <el-select v-model="statusFilter" placeholder="选择状态" clearable class="filter-item status-select"
        @change="applyFilters">
        <el-option label="已预约" value="已预约"></el-option>
        <el-option label="未归还" value="未归还"></el-option>
        <el-option label="已归还" value="已归还"></el-option>
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="filter-item"
        @change="applyFilters"></el-date-picker>
      <el-input v-model="searchQuery" placeholder="搜索西服编号、学生姓名、学号" class="filter-item" @input="applyFilters"></el-input>
    </div>

    <!-- 电脑端表格展示 -->
    <el-table :data="rentals" style="width: 100%" class="custom-table desktop-only">
      <el-table-column prop="suit_number" label="西服编号" sortable></el-table-column>
      <el-table-column prop="student_name" label="学生姓名" sortable></el-table-column>
      <el-table-column prop="student_id" label="学号" sortable></el-table-column>
      <el-table-column prop="contact_info" label="联系方式"></el-table-column>
      <el-table-column prop="rental_time" label="租赁时间" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.rental_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="expected_return_time" label="预计归还时间" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.expected_return_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="showEditDialog(scope.row)" class="edit-button">修改</el-button>
          <el-button size="small" type="danger" @click="deleteRental(scope.row.id)" class="delete-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 手机端卡片式展示 -->
    <div class="mobile-only">
      <el-card v-for="rental in rentals" :key="rental.id" class="rental-card">
        <template #header>
          <div class="card-header">
            <span>{{ rental.student_name }}</span>
            <el-tag :type="getStatusType(rental.status)">{{ rental.status }}</el-tag>
          </div>
        </template>
        <div class="card-content">
          <p><strong>西服编号：</strong>{{ rental.suit_number }}</p>
          <p><strong>学号：</strong>{{ rental.student_id }}</p>
          <p><strong>联系方式：</strong>{{ rental.contact_info }}</p>
          <p><strong>租赁时间：</strong>{{ formatDate(rental.rental_time) }}</p>
          <p><strong>预计归还时间：</strong>{{ formatDate(rental.expected_return_time) }}</p>
        </div>
        <div class="card-actions">
          <el-button size="small" @click="showEditDialog(rental)">修改</el-button>
          <el-button size="small" type="danger" @click="deleteRental(rental.id)">删除</el-button>
        </div>
      </el-card>
    </div>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalRentals" class="pagination">
    </el-pagination>

    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="西服编号" required>
          <el-input v-model="form.suit_number"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" required>
          <el-input v-model="form.student_name"></el-input>
        </el-form-item>
        <el-form-item label="学号" required>
          <el-input v-model="form.student_id"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" required>
          <el-input v-model="form.contact_info"></el-input>
        </el-form-item>
        <el-form-item label="租赁时间" required>
          <el-date-picker v-model="form.rental_time" type="date" placeholder="选择日期" value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计归还时间" required>
          <el-date-picker v-model="form.expected_return_time" type="date" placeholder="选择日期" value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="已预约" value="已预约"></el-option>
            <el-option label="未归还" value="未归还"></el-option>
            <el-option label="已归还" value="已归还"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.notes"></el-input>
        </el-form-item>
        <el-form-item label="添加者" v-if="form.creator_username">
          <el-input v-model="form.creator_username" disabled></el-input>
        </el-form-item>
        <el-form-item label="添加时间" v-if="form.created_at">
          <el-input v-model="form.created_at" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改者" v-if="form.updater_username">
          <el-input v-model="form.updater_username" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改时间" v-if="form.updated_at">
          <el-input v-model="form.updated_at" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'SuitRental',
  setup() {
    const store = useStore()
    const rentals = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalRentals = ref(0)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const statusFilter = ref('')
    const dateRange = ref([])
    const searchQuery = ref('')
    const form = ref({
      suit_number: '',
      student_name: '',
      student_id: '',
      contact_info: '',
      rental_time: '',
      expected_return_time: '',
      status: '已预约',
      notes: '',
      creator_username: '',
      created_at: '',
      updater_username: '',
      updated_at: ''
    })

    const fetchRentals = async () => {
      const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        status: statusFilter.value,
        startDate: dateRange.value && dateRange.value.length > 0 ? dateRange.value[0] : null,
        endDate: dateRange.value && dateRange.value.length > 1 ? dateRange.value[1] : null,
        search: searchQuery.value
      }
      const response = await store.dispatch('suitRental/fetchRentals', params)
      rentals.value = response.rentals
      totalRentals.value = response.total
    }


    onMounted(() => {
      fetchRentals()
    })

    watch([currentPage, pageSize], () => {
      fetchRentals()
    })

    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const showAddDialog = () => {
      dialogTitle.value = '新增租赁'
      form.value = {
        suit_number: '',
        student_name: '',
        student_id: '',
        contact_info: '',
        rental_time: '',
        expected_return_time: '',
        status: '未归还',
        notes: '',
        creator_username: '',
        created_at: '',
        updater_username: '',
        updated_at: ''
      }
      dialogVisible.value = true
    }

    const showEditDialog = (rental) => {
      dialogTitle.value = '修改租赁'
      form.value = { ...rental }
      dialogVisible.value = true
    }

    const formatDateForBackend = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return d.toISOString().slice(0, 10)
    }

    const submitForm = async () => {
      // 检查必填字段
      if (!form.value.suit_number || !form.value.student_name || !form.value.student_id ||
        !form.value.contact_info || !form.value.rental_time || !form.value.expected_return_time) {
        ElMessage.error('西服编号、学生姓名、学号、联系方式、租赁时间和预计归还时间为必填项')
        return
      }

      // 检查日期
      if (new Date(form.value.expected_return_time) < new Date(form.value.rental_time)) {
        ElMessage.error('预计归还时间不能早于租赁时间')
        return
      }

      const formattedForm = {
        ...form.value,
        rental_time: formatDateForBackend(form.value.rental_time),
        expected_return_time: formatDateForBackend(form.value.expected_return_time)
      }

      try {
        if (dialogTitle.value === '新增租赁') {
          await store.dispatch('suitRental/addRental', formattedForm)
          ElMessage.success('租赁信息添加成功')
        } else {
          await store.dispatch('suitRental/updateRental', formattedForm)
          ElMessage.success('租赁信息更新成功')
        }
        dialogVisible.value = false
        fetchRentals()
      } catch (error) {
        ElMessage.error('操作失败: ' + error.message)
      }
    }

    const deleteRental = async (id) => {
      try {
        await ElMessageBox.confirm('确定要删除这条租赁记录吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await store.dispatch('suitRental/deleteRental', id)
        ElMessage.success('租赁记录删除成功')
        fetchRentals()
      } catch (error) {
        console.error('删除失败:', error)
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      if (dateRange.value === null) {
        dateRange.value = [] // 如果被清除，将其设置为空数组而不是 null
      }
      fetchRentals()
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return dateString
    }

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return ''
      return new Date(dateTimeString).toLocaleString()
    }

    const getStatusType = (status) => {
      switch (status) {
        case '已预约':
          return 'warning'
        case '未归还':
          return 'danger'
        case '已归还':
          return 'success'
        default:
          return 'info'
      }
    }

    return {
      rentals,
      currentPage,
      pageSize,
      totalRentals,
      dialogVisible,
      dialogTitle,
      statusFilter,
      dateRange,
      searchQuery,
      form,
      handleSizeChange,
      handleCurrentChange,
      showAddDialog,
      showEditDialog,
      submitForm,
      deleteRental,
      applyFilters,
      formatDate,
      formatDateTime,
      getStatusType
    }
  }
}
</script>

<style scoped>
.suit-rental {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.add-button {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 10px;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.custom-table {
  margin-bottom: 20px;
}

.pagination {
  text-align: right;
  margin-top: 20px;
}

.edit-button,
.delete-button {
  margin-right: 5px;
}

.status-select {
  width: 200px;
}

.rental-card {
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  padding: 10px 15px;
  border-bottom: 1px solid #e4e7ed;
}

.card-content {
  padding: 15px;
}

.card-content p {
  margin: 5px 0;
  line-height: 1.5;
}

.card-actions {
  margin-top: 10px;
  text-align: right;
  padding: 0 15px 15px;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .filters {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .rental-card {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}

.el-dialog__body {
  padding-top: 10px;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input,
.el-select,
.el-date-picker {
  width: 100%;
}

.el-textarea__inner {
  min-height: 100px;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: none !important;
  }
}
</style>
