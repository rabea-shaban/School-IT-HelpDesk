export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'it_staff';
}
