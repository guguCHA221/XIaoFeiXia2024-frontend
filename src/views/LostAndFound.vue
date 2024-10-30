<template>
  <div class="lost-and-found">
    <h2 class="title">失物招领</h2>

    <el-button type="primary" @click="showAddDialog" class="add-button">新增物品</el-button>

    <div class="filters">
      <el-select v-model="statusFilter" placeholder="选择状态" clearable class="filter-item status-select"
        @change="applyFilters">
        <el-option label="未领取" value="未领取"></el-option>
        <el-option label="已领取" value="已领取"></el-option>
        <el-option label="过期处理" value="过期处理"></el-option>
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="filter-item"
        @change="applyFilters"></el-date-picker>
      <el-input v-model="searchQuery" placeholder="搜索编号、名称、公开信息、隐藏信息、拾取地点" class="filter-item"
        @input="applyFilters"></el-input>
    </div>

    <!-- 电脑端表格展示 -->
    <el-table :data="items" style="width: 100%" class="custom-table desktop-only">
      <el-table-column prop="id" label="编号" sortable></el-table-column>
      <el-table-column prop="name" label="名称" sortable></el-table-column>
      <el-table-column prop="public_info" label="公开信息"></el-table-column>
      <el-table-column prop="private_info" label="隐藏信息"></el-table-column>
      <el-table-column prop="found_location" label="拾取地点" sortable></el-table-column>
      <el-table-column prop="created_at" label="入库时间" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="showEditDialog(scope.row)" class="edit-button">修改</el-button>
          <el-button size="small" type="danger" @click="deleteItem(scope.row.id)" class="delete-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 手机端卡片式展示 -->
    <div class="mobile-only">
      <el-card v-for="item in items" :key="item.id" class="item-card">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <el-tag :type="getStatusType(item.status)">{{ item.status }}</el-tag>
          </div>
        </template>
        <div class="card-content">
          <p><strong>编号：</strong>{{ item.id }}</p>
          <p><strong>公开信息：</strong>{{ item.public_info }}</p>
          <p><strong>拾取地点：</strong>{{ item.found_location }}</p>
          <p><strong>入库时间：</strong>{{ formatDate(item.created_at) }}</p>
        </div>
        <div class="card-actions">
          <el-button size="small" @click="showEditDialog(item)">修改</el-button>
          <el-button size="small" type="danger" @click="deleteItem(item.id)">删除</el-button>
        </div>
      </el-card>
    </div>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems" class="pagination">
    </el-pagination>

    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" label-width="120px">
        <el-form-item label="物品类型">
          <el-radio-group v-model="form.item_type">
            <el-radio v-for="type in itemTypes" :key="type.type_code" :label="type.type_code">
              {{ type.type_name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="公开信息">
          <el-input type="textarea" v-model="form.public_info"></el-input>
        </el-form-item>
        <el-form-item label="隐藏信息">
          <el-input type="textarea" v-model="form.private_info"></el-input>
        </el-form-item>
        <el-form-item label="拾取地点">
          <el-radio-group v-model="form.found_location">
            <el-radio label="巡天楼">巡天楼</el-radio>
            <el-radio label="牧星楼">牧星楼</el-radio>
            <el-radio label="明慧楼">明慧楼</el-radio>
            <el-radio label="笃行楼">笃行楼</el-radio>
            <el-radio label="风雨操场">风雨操场</el-radio>
            <el-radio label="健翔体育馆">健翔体育馆</el-radio>
            <el-radio label="b8">b8</el-radio>
            <el-radio label="科技馆">科技馆</el-radio>
            <el-radio label="社科馆">社科馆</el-radio>
            <el-radio label="文艺馆">文艺馆</el-radio>
            <el-radio label="图书馆">图书馆</el-radio>
            <el-radio label="其他">其他</el-radio>
          </el-radio-group>
          <el-input v-if="form.found_location === '其他'" v-model="form.other_location" placeholder="请输入其他地点"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" :disabled="!isEditing">
            <el-option label="未领取" value="未领取"></el-option>
            <el-option label="已领取" value="已领取"></el-option>
            <el-option label="过期处理" value="过期处理"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="form.status === '已领取'">
          <el-form-item label="领取人姓名">
            <el-input v-model="form.claimer_name"></el-input>
          </el-form-item>
          <el-form-item label="领取人学号">
            <el-input v-model="form.claimer_student_id"></el-input>
          </el-form-item>
          <el-form-item label="领取人电话">
            <el-input v-model="form.claimer_phone"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="修改时间">
          <el-input v-model="form.updated_at" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改用户">
          <el-input v-model="form.updater_username" disabled></el-input>
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
  name: 'LostAndFound',
  setup() {
    const store = useStore()
    const items = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalItems = ref(0)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const statusFilter = ref('')
    const dateRange = ref([])
    const form = ref({
      name: '',
      public_info: '',
      private_info: '',
      found_location: '',
      other_location: '',
      status: '未领取',
      item_type: '',
      claimer_name: '',
      claimer_student_id: '',
      claimer_phone: '',
      updated_at: '',
      updater_username: ''
    })

    const isEditing = ref(false)

    const itemTypes = ref([
      { type_code: 'Y', type_name: '衣帽眼镜' },
      { type_code: 'U', type_name: '雨伞' },
      { type_code: 'B', type_name: '书籍' },
      { type_code: 'D', type_name: '电子产品' },
      { type_code: 'S', type_name: '体育用品' },
      { type_code: 'W', type_name: '水杯' },
      { type_code: 'C', type_name: '证件' },
      { type_code: 'G', type_name: '箱包' },
      { type_code: 'Z', type_name: '其他' }
    ])

    const lastSelection = ref({
      found_location: '',
      item_type: ''
    })

    const searchQuery = ref('')

    const fetchItems = async () => {
      try {
        const response = await store.dispatch('lostAndFound/fetchItems', {
          page: currentPage.value,
          pageSize: pageSize.value,
          status: statusFilter.value,
          startDate: dateRange.value && dateRange.value.length > 0 ? dateRange.value[0] : null,
          endDate: dateRange.value && dateRange.value.length > 1 ? dateRange.value[1] : null,
          search: searchQuery.value
        })
        items.value = response.items
        totalItems.value = response.total
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    onMounted(() => {
      fetchItems()
    })

    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchItems()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchItems()
    }

    const showAddDialog = () => {
      dialogTitle.value = '新增物品'
      form.value = {
        name: '',
        public_info: '',
        private_info: '',
        found_location: lastSelection.value.found_location,
        status: '未领取',
        item_type: lastSelection.value.item_type,
        claimer_name: '',
        claimer_student_id: '',
        claimer_phone: '',
        updated_at: '',
        updater_username: ''
      }
      isEditing.value = false
      dialogVisible.value = true
    }

    const showEditDialog = (item) => {
      dialogTitle.value = '修改物品'
      form.value = { ...item }
      form.value.updated_at = formatDate(item.updated_at)
      isEditing.value = true

      // 检查拾取地点是否在预定义列表中
      const predefinedLocations = ['巡天楼', '牧星楼', '明慧楼', '笃行楼', '风雨操场', '健翔体育馆', 'b8', '科技馆', '社科馆', '文艺馆', '图书馆']
      if (!predefinedLocations.includes(form.value.found_location)) {
        form.value.other_location = form.value.found_location
        form.value.found_location = '其他'
      }

      dialogVisible.value = true
    }

    const submitForm = async () => {
      let formData = { ...form.value }
      if (formData.found_location === '其他') {
        formData.found_location = formData.other_location
      }
      delete formData.other_location

      // 保存最后的选择
      lastSelection.value.found_location = formData.found_location
      lastSelection.value.item_type = formData.item_type

      try {
        if (isEditing.value) {
          await store.dispatch('lostAndFound/updateItem', formData)
        } else {
          await store.dispatch('lostAndFound/addItem', formData)
        }
        dialogVisible.value = false
        ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
        fetchItems()
      } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error('操作失败，请重试')
      }
    }


    const deleteItem = (id) => {
      ElMessageBox.confirm('确定要删除这个物品吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await store.dispatch('lostAndFound/deleteItem', id)
          ElMessage.success('删除成功')
          fetchItems()
        } catch (error) {
          console.error('Error deleting item:', error)
          ElMessage.error('删除失败，请重试')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    }

    const getItemTypeName = (typeCode) => {
      const type = itemTypes.value.find(t => t.type_code === typeCode)
      return type ? type.type_name : '未知'
    }

    const applyFilters = () => {
      currentPage.value = 1
      if (dateRange.value === null) {
        dateRange.value = [] // 如果被清除，将其设置为空数组而不是 null
      }
      fetchItems()
    }

    const getStatusType = (status) => {
      switch (status) {
        case '未领取':
          return 'warning'
        case '已领取':
          return 'success'
        case '过期处理':
          return 'info'
        default:
          return ''
      }
    }

    watch([statusFilter, dateRange, searchQuery], () => {
      applyFilters()
    })

    return {
      items,
      currentPage,
      pageSize,
      totalItems,
      dialogVisible,
      dialogTitle,
      form,
      handleSizeChange,
      handleCurrentChange,
      showAddDialog,
      showEditDialog,
      submitForm,
      deleteItem,
      formatDate,
      itemTypes,
      getItemTypeName,
      statusFilter,
      dateRange,
      applyFilters,
      lastSelection,
      searchQuery,
      isEditing,
      getStatusType,
    }
  }
}
</script>

<style scoped>
.lost-and-found {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
}

.add-button {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  margin-bottom: 20px;
}

.filter-item {
  margin-right: 10px;
}

.custom-table {
  margin-bottom: 20px;
}

.pagination {
  text-align: right;
}

.edit-button,
.delete-button {
  margin-right: 5px;
}

.status-select {
  width: 200px;
}

.item-card {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content p {
  margin: 5px 0;
}

.card-actions {
  margin-top: 10px;
  text-align: right;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .filters {
    flex-direction: column;
  }

  .filter-item {
    margin-bottom: 10px;
    width: 100%;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: none !important;
  }
}
</style>
