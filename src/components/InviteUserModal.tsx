// src/components/InviteUserModal.tsx

import React, { useState, Fragment } from 'react';
import { Dialog, Transition, Combobox, RadioGroup } from '@headlessui/react';
import {
  CheckIcon as CheckMarkIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'; // Using a better icon library

// --- Interfaces & Data --- //

interface User {
  UID: number;
  Username: string;
}

export interface FormData {
  uid: number;
  role: 'user' | 'admin' | 'manager';
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[]; // A list of users that can be invited
  onSubmit: (formData: FormData) => Promise<void>;
}

const roles = [
  {
    name: 'Admin',
    value: 'admin' as const,
    description: 'Full access to all settings.',
  },
  {
    name: 'Manager',
    value: 'manager' as const,
    description: 'Can manage members.',
  },
  {
    name: 'User',
    value: 'user' as const,
    description: 'Can view and interact.',
  },
];

// --- Helper Component for Role Checkmark --- //

const RoleCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
    <path
      d="M7 13l3 3 7-7"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Main Component --- //

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  users,
  onSubmit,
}) => {
  // --- Internal State Management --- //
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    'user' | 'admin' | 'manager'
  >('user');
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers =
    query === ''
      ? users
      : users.filter((user) =>
          user.Username.toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  // --- Handlers --- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a user to invite.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ uid: selectedUser.UID, role: selectedRole });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRole('user');
    setQuery('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              as="form"
              onSubmit={handleSubmit}
              className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800"
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Invite a New Member
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a user and assign them a role within the group.
              </Dialog.Description>

              {/* User Selection Combobox */}
              <div className="mt-4">
                <Combobox value={selectedUser} onChange={setSelectedUser}>
                  <Combobox.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    User <span className="text-red-500">*</span>
                  </Combobox.Label>
                  <div className="relative mt-1">
                    <Combobox.Input
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      displayValue={(user: User | null) => user?.Username || ''}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search for a user..."
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  {/* CORE FIX: The Transition MUST wrap Combobox.Options */}
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full max-w-md overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:bg-gray-700">
                      {filteredUsers.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-300">
                          Nothing found.
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <Combobox.Option
                            key={user.UID}
                            value={user}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-white'}`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                >
                                  {user.Username}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'}`}
                                  >
                                    <CheckMarkIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </Combobox>
              </div>

              {/* Role Selection RadioGroup */}
              <div className="mt-4">
                <RadioGroup value={selectedRole} onChange={setSelectedRole}>
                  <RadioGroup.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role <span className="text-red-500">*</span>
                  </RadioGroup.Label>
                  <div className="mt-1 space-y-2">
                    {roles.map((role) => (
                      <RadioGroup.Option
                        key={role.name}
                        value={role.value}
                        className={({ active, checked }) =>
                          `${active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300' : ''} ${checked ? 'bg-sky-600 text-white' : 'bg-white dark:bg-gray-900/75'} relative flex cursor-pointer rounded-lg px-5 py-3 shadow-md focus:outline-none transition`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${checked ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
                                >
                                  {role.name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${checked ? 'text-sky-100' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                  {role.description}
                                </RadioGroup.Description>
                              </div>
                              {checked && (
                                <div className="flex-shrink-0 text-white">
                                  <RoleCheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:ring-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Inviting...' : 'Invite Member'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InviteUserModal;
