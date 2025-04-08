const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchStones() {
  const response = await fetch(`${API_URL}/stones`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные о камнях');
  }
  return response.json();
}

export async function fetchStoneById(id: number) {
  const response = await fetch(`${API_URL}/stones/${id}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные о камне');
  }
  return response.json();
}

export async function fetchServices() {
  const response = await fetch(`${API_URL}/services`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные об услугах');
  }
  return response.json();
}

export async function fetchServiceById(id: number) {
  const response = await fetch(`${API_URL}/services/${id}`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные об услуге');
  }
  return response.json();
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка при отправке формы');
  }
  
  return response.json();
}