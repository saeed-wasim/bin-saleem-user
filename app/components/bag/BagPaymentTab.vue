<script setup>
// Card fields below are local UI state only — never sent to the backend or
// stored anywhere. Only `paymentMethod` (the selected label) is transmitted.
const paymentMethod = ref('PayFast')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')

function getPaymentMethod() {
  return paymentMethod.value
}

defineExpose({ getPaymentMethod })
</script>

<template>
  <div class="border border-gray-200 rounded p-6">
    <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Payment Type</h2>

    <div class="space-y-3">
      <label
        class="flex items-center justify-between border rounded px-4 py-3 cursor-pointer"
        :class="paymentMethod === 'PayFast' ? 'border-theme' : 'border-gray-200'"
      >
        <span class="text-sm font-medium">PayFast &mdash; All Credit cards, Bank Transfer, Jazz cash, Easy Paisa</span>
        <input v-model="paymentMethod" type="radio" value="PayFast" />
      </label>
      <label
        class="flex items-center justify-between border rounded px-4 py-3 cursor-pointer"
        :class="paymentMethod === 'Alfalah Credit Card' ? 'border-theme' : 'border-gray-200'"
      >
        <span class="text-sm font-medium">Alfalah Credit Card</span>
        <input v-model="paymentMethod" type="radio" value="Alfalah Credit Card" />
      </label>
    </div>

    <div class="mt-6 space-y-4">
      <input v-model="cardNumber" type="text" maxlength="19" placeholder="Card Number" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" />
      <div class="grid grid-cols-2 gap-4">
        <input v-model="expiry" type="text" maxlength="5" placeholder="MM/YY" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" />
        <input v-model="cvv" type="password" maxlength="4" placeholder="CVV" class="w-full border border-gray-300 rounded px-4 py-2 text-sm" />
      </div>
      <p class="text-xs text-gray-400">Demo checkout — card details are never sent or stored.</p>
    </div>
  </div>
</template>
