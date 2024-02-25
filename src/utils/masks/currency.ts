export function maskCurrency(value: any): string {
  if (!value) return ''

  const numericValue = value.replace(/\D/g, '')

  const formattedValue = (Number(numericValue) / 100).toFixed(2)

  const parts = formattedValue.split('.')
  parts[0] = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

  return `R$ ${parts.join(',')}`
}

export function handleChangeCurrency(event: any, field: string, setValue: any) {
  const maskedValue = maskCurrency(event.target.value)
  setValue(field, maskedValue)
}
