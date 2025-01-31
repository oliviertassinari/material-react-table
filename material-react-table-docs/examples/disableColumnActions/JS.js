import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';

const Example = () => {
  const columns = useMemo(
    () => [
      {
        header: 'ID',
        id: 'id',
        enableColumnActions: false,
      },
      {
        header: 'First Name',
        id: 'firstName',
      },
      {
        header: 'Last Name',
        id: 'lastName',
      },
    ],
    [],
  );

  const data = useMemo(
    () => [
      //data definitions...
      {
        id: 1,
        firstName: 'Dylan',
        lastName: 'Murray',
      },
      {
        id: 2,
        firstName: 'Raquel',
        lastName: 'Kohler',
      },
      //end
    ],
    [],
  );

  return <MaterialReactTable columns={columns} data={data} />;
};

export default Example;
