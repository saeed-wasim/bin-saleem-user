<script setup>
const { profile, fetchMe, updateMe } = useCustomerProfile()
const { user } = useAuth()

const editing = ref(false)
const form = ref({ name: '', phone: '', city: '', street: '' })
const saving = ref(false)
const formError = ref(null)

const hasAddress = computed(() => !!profile.value?.street)

onMounted(async () => {
  try {
    const me = await fetchMe()
    form.value = {
      name: me.name || '',
      phone: me.phone || '',
      city: me.city || '',
      street: me.street || '',
    }
    if (!me.street) editing.value = true
  } catch (err) {
    editing.value = true
  }
})

async function handleSave() {
  if (!form.value.name || !form.value.phone || !form.value.city || !form.value.street) {
    formError.value = 'Name, street, phone, and city are required'
    return
  }
  if (!/^\d{11}$/.test(form.value.phone)) {
    formError.value = 'Phone number must be exactly 11 digits'
    return
  }
  formError.value = null
  saving.value = true
  try {
    await updateMe(form.value)
    editing.value = false
  } catch (err) {
    formError.value = err.data?.error || err.message || 'Unable to save address'
  } finally {
    saving.value = false
  }
}

async function confirmAddress() {
  if (editing.value) {
    await handleSave()
    if (editing.value) return null
  }
  if (!profile.value?.street) return null
  return {
    name: profile.value.name,
    phone: profile.value.phone,
    city: profile.value.city,
    street: profile.value.street,
  }
}

defineExpose({ confirmAddress })
</script>

<template>
  <div class="border border-gray-200 rounded p-6">
    <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Delivery Address</h2>

    <div v-if="!editing && hasAddress" class="text-sm text-gray-700 space-y-1">
      <p class="font-semibold text-gray-900">{{ profile.name }}</p>
      <p>{{ profile.street }}</p>
      <p>{{ profile.phone }}</p>
      <p>{{ profile.city }}</p>
      <p>{{ user?.email }}</p>
    </div>

    <form v-if="editing" class="space-y-4 mt-4" @submit.prevent="handleSave">
      <input v-model="form.name" type="text" placeholder="Full Name" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" required />
      <input v-model="form.street" type="text" placeholder="Street Address" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" required />
      <input
        v-model="form.phone"
        type="text"
        inputmode="numeric"
        maxlength="11"
        placeholder="Phone Number (11 digits)"
        class="w-full border border-gray-300 rounded px-4 py-2 text-sm"
        required
      />
      <input v-model="form.city" type="text" placeholder="City" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" required />
      <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>
      <button
        type="submit"
        class="border border-gray-300 rounded px-6 py-2 text-sm font-semibold hover:border-theme hover:text-theme disabled:opacity-60"
        :disabled="saving"
      >
        {{ saving ? 'Saving...' : 'Save Address' }}
      </button>
    </form>

    <button
      v-else
      type="button"
      class="mt-4 border border-gray-300 rounded px-6 py-2 text-sm font-semibold hover:border-theme hover:text-theme"
      @click="editing = true"
    >
      Change or Add Address
    </button>
  </div>
</template>
