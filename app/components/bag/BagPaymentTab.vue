<script setup>
const paymentMethod = ref('Card (Stripe)')

function getPaymentMethod() {
  return paymentMethod.value
}

defineExpose({ getPaymentMethod })
</script>

<template>
  <div class="border border-gray-200 rounded p-6">
    <h2 class="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Payment</h2>

    <div class="space-y-3">
      <button
        type="button"
        class="w-full text-left border rounded px-4 py-3 transition-colors"
        :class="paymentMethod === 'Card (Stripe)' ? 'border-theme' : 'border-gray-200 hover:border-gray-300'"
        @click="paymentMethod = 'Card (Stripe)'"
      >
        <p class="text-sm font-medium text-gray-900">Pay securely by card</p>
        <p class="text-xs text-gray-500 mt-1">
          You'll be redirected to Stripe's secure checkout to enter your card details.
        </p>
      </button>

      <button
        type="button"
        class="w-full text-left border rounded px-4 py-3 transition-colors"
        :class="paymentMethod === 'Cash on Delivery' ? 'border-theme' : 'border-gray-200 hover:border-gray-300'"
        @click="paymentMethod = 'Cash on Delivery'"
      >
        <p class="text-sm font-medium text-gray-900">Cash on Delivery</p>
        <p class="text-xs text-gray-500 mt-1">
          Pay in cash when your order arrives.
        </p>
      </button>
    </div>

    <p v-if="paymentMethod === 'Card (Stripe)'" class="text-xs text-gray-400 mt-4">
      Test mode — no real charge is made. Use card number 4242 4242 4242 4242, any future
      expiry date, and any CVC.
    </p>
  </div>
</template>
