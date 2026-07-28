export function useLoginDrawer() {
  const isOpen = useState('login-drawer-open', () => false)

  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
  }
}
