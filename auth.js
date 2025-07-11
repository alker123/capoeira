import { db3 } from './firebase.js';
import { ref, get } from 'firebase/database';

export async function autenticarUsuario(usuario, senha) {
  try {
    const usersRef = ref(db3, 'usuarios');
    const snapshot = await get(usersRef);
    const users = snapshot.val();

    for (const key in users) {
      const user = users[key];
      if (user.usuario === usuario && user.senha === senha) {
        return user.tipo; // retorna o tipo se autenticado
      }
    }

    return null; // usuário ou senha incorretos
  } catch (error) {
    console.error('Erro no Firebase:', error);
    throw error;
  }
}
