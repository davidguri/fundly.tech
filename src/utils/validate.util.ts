export class validate {
  static async email(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async password(password: string): Promise<boolean> {
    return password ? true : false; // TODO: add this functionality
  }
}