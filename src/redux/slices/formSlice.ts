import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AddUserFormState, RoleAssignmentFormState } from '../../types/form';
import { validatePermissions, validatePassword, checkEmailUniqueness, validateEmail } from '../../utils/validation';
import { User } from '../../types';

const initialPermissions: Record<'Dashboard' | 'Reports' | 'Settings', Record<'Read' | 'Write' | 'Delete' | 'Share', boolean>> = {
  Dashboard: { Read: false, Write: false, Delete: false, Share: false },
  Reports: { Read: false, Write: false, Delete: false, Share: false },
  Settings: { Read: false, Write: false, Delete: false, Share: false },
};

const initialAddUserState: AddUserFormState = {
  name: '',
  email: '',
  password: '',
  role: 'Viewer',
  permissions: initialPermissions,
  errors: [],
};

const initialRoleAssignmentState: RoleAssignmentFormState = {
  role: 'Viewer',
  permissions: initialPermissions,
  errors: [],
};

interface FormState {
  addUser: AddUserFormState;
  roleAssignment: RoleAssignmentFormState;
}

const initialState: FormState = {
  addUser: initialAddUserState,
  roleAssignment: initialRoleAssignmentState,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateAddUserField: (
      state,
      action: PayloadAction<Partial<AddUserFormState>>
    ) => {
      state.addUser = { ...state.addUser, ...action.payload };
    },
    updateRoleAssignmentField: (
      state,
      action: PayloadAction<Partial<RoleAssignmentFormState>>
    ) => {
      state.roleAssignment = { ...state.roleAssignment, ...action.payload };
    },
    setAddUserPermissions: (
      state,
      action: PayloadAction<{
        module: 'Dashboard' | 'Reports' | 'Settings';
        permission: 'Read' | 'Write' | 'Delete' | 'Share';
        value: boolean;
      }>
    ) => {
      const { module, permission, value } = action.payload;
      state.addUser.permissions[module][permission] = value;
      state.addUser.errors = validatePermissions(state.addUser.permissions);
    },
    setRoleAssignmentPermissions: (
      state,
      action: PayloadAction<{
        module: 'Dashboard' | 'Reports' | 'Settings';
        permission: 'Read' | 'Write' | 'Delete' | 'Share';
        value: boolean;
      }>
    ) => {
      const { module, permission, value } = action.payload;
      state.roleAssignment.permissions[module][permission] = value;
      state.roleAssignment.errors = validatePermissions(state.roleAssignment.permissions);
    },
    validateAddUserForm: (state, action: PayloadAction<User[]>) => {
      const users = action.payload;
    
      // First, validate email format
      const emailFormatErrors = validateEmail(state.addUser.email);
    
      // If email format is valid, check for uniqueness
      const emailUniquenessErrors =
        emailFormatErrors.length === 0 && !checkEmailUniqueness(state.addUser.email, users)
          ? ['Email already exists']
          : [];
    
      const passwordErrors = validatePassword(state.addUser.password);
    
      const permissionErrors =
        state.addUser.role === 'Custom' && state.addUser.errors.length > 0
          ? ['Invalid permissions']
          : [];
    
      state.addUser.errors = [
        ...emailFormatErrors,
        ...emailUniquenessErrors,
        ...passwordErrors,
        ...permissionErrors,
      ];
    },
    resetAddUserForm: (state) => {
      state.addUser = initialAddUserState;
    },
    resetRoleAssignmentForm: (state) => {
      state.roleAssignment = initialRoleAssignmentState;
    },
  },
});

export const {
  updateAddUserField,
  updateRoleAssignmentField,
  setAddUserPermissions,
  setRoleAssignmentPermissions,
  validateAddUserForm,
  resetAddUserForm,
  resetRoleAssignmentForm,
} = formSlice.actions;
export default formSlice.reducer;