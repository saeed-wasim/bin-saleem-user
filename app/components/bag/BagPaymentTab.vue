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

    <div class="border border-theme rounded px-4 py-3">
      <p class="text-sm font-medium text-gray-900">Pay securely by card</p>
      <p class="text-xs text-gray-500 mt-1">
        You'll be redirected to Stripe's secure checkout to enter your card details.
      </p>
    </div>

    <p class="text-xs text-gray-400 mt-4">
      Test mode — no real charge is made. Use card number 4242 4242 4242 4242, any future
      expiry date, and any CVC.
    </p>
  </div>
</template>
