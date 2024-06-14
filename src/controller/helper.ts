export function validatePassword(password: string) {
    const isBetween_8_to_40 = password.length >= 8 && password.length <= 40;
    const hasNoSpaces = !password.includes(' ');
  
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasSpecialCharacter = false;
    let hasNumber = false;
  
    for (const char of password) {
      if (char >= 'A' && char <= 'Z') {
        hasUpperCase = true;
      } else if (char >= 'a' && char <= 'z') {
        hasLowerCase = true;
      } else if ("!@#$%^&*()_+{}[]:;<>,.?~-".includes(char)) {
        hasSpecialCharacter = true;
      } else if (char >= '0' && char <= '9') {
        hasNumber = true;
      }
    }
  
    return isBetween_8_to_40 && hasUpperCase && hasLowerCase && hasSpecialCharacter && hasNumber && hasNoSpaces;
  }
  