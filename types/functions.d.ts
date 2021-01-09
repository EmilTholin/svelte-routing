type navigate = (
  to: string,
  {
    replace,
    state
  }?: {
    replace?: boolean
    state?: {
      [k in string | number]: unknown
    }
  }
) => void

export { navigate }
