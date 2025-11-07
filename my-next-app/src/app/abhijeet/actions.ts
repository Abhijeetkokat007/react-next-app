'use server'

export async function registerUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const age = formData.get('age')

  // Validate data
  if (!name || !email || !age) {
    return { error: 'All fields are required' }
  }

  // Normally you would save to a database here
  console.log('Registering user:', {
    name,
    email,
    age
  })

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: 'User registered successfully!' }
  
}