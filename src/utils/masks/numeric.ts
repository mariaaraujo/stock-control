function maskNumeric(value: any) {
  return value.replace(/\D/g, "");
}

export function handleNumericChange(event: any, name: string, setValue: any) {
  const maskedValue = maskNumeric(event.target.value);

  setValue(name, maskedValue);
}