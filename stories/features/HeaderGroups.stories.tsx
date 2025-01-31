import React from 'react';
import { Meta, Story } from '@storybook/react';
import MaterialReactTable, { MaterialReactTableProps } from '../../src';
import faker from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Header Groups Examples',
  parameters: {
    status: {
      type: 'stable',
    },
  },
};

export default meta;

export const HeaderGroups: Story<MaterialReactTableProps> = () => (
  <MaterialReactTable
    columns={[
      {
        header: 'Name',
        id: 'name',
        columns: [
          {
            header: 'First Name',
            id: 'firstName',
          },

          {
            header: 'Last Name',
            id: 'lastName',
          },
        ],
      },
      {
        header: 'Info',
        id: 'info',
        columns: [
          {
            header: 'Age',
            id: 'age',
          },
          {
            header: 'Address',
            id: 'address',
          },
        ],
      },
    ]}
    data={[...Array(5)].map((_) => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number(80),
      address: faker.address.streetAddress(),
    }))}
  />
);

export const HeaderAndFooterGroups: Story<MaterialReactTableProps> = () => (
  <MaterialReactTable
    columns={[
      {
        header: 'Name',
        id: 'name',
        footer: 'Name',
        columns: [
          {
            header: 'First Name',
            footer: 'First Name',
            id: 'firstName',
          },

          {
            header: 'Last Name',
            footer: 'Last Name',
            id: 'lastName',
          },
        ],
      },
      {
        header: 'Info',
        id: 'info',
        footer: 'Info',
        columns: [
          {
            header: 'Age',
            footer: 'Age',
            id: 'age',
          },
          {
            header: 'Address',
            footer: 'Address',
            id: 'address',
          },
        ],
      },
    ]}
    data={[...Array(5)].map((_) => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number(80),
      address: faker.address.streetAddress(),
    }))}
  />
);
