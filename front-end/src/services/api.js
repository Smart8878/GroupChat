const API_URL = 'http://localhost:8081';

export const createGroup = async (name) => {
  const response = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  return response.json();
};

export const getGroups = async () => {
  const response = await fetch(`${API_URL}/groups`);
  return response.json();
};

export const addMember = async (groupId, user) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name:user.name }),
  });
  return response.json();
};
