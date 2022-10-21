import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './projects.css';

function eventNotImplemented() {
  alert('This component\'s event is not implemented!');
}

// Hardware set display component
function HardwareSet(props) {
  const [qty, changeQty] = useState(0);
  function handleChangeQty(event) {
    changeQty(event.target.value);
  }

  function checkIn(qty) {
    fetch(`/api/${props.projectName}/checkIn/${qty}`, {
      method: 'POST',
    })
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        alert(text);
      });
  }
  function checkOut(qty) {
    fetch(`/api/${props.projectName}/checkOut/${qty}`, {
      method: 'POST',
    })
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        alert(text);
      });
  }

  return (
    <div className="flex-parent">
      <p className="flex-child-1">{`${props.name}: ${props.checkedOut}/${props.availability}`}</p>
      <div className="flex-child-4">
        <TextField label="Enter qty" variant="filled" type="number" disabled={!props.userCanModify} value={qty} onChange={handleChangeQty} />
        <Button className="button-fit" variant="contained" disabled={!props.userCanModify} onClick={() => checkIn(qty)}>Check In</Button>
        <Button className="button-fit" variant="contained" disabled={!props.userCanModify} onClick={() => checkOut(qty)}>Check Out</Button>
      </div>
    </div>
  );
}

// Project component
function Project(props) {
  // List all authorized users
  let authorizedUsersString = '';
  for (let i = 0; i < props.users.length; i++) {
    if (i !== 0) {
      authorizedUsersString += ', ';
    }

    authorizedUsersString += props.users[i];
  }
  if (props.userHasAccess) {
    authorizedUsersString += ', you';
  }

  // List all hardware sets
  let hardwareSets = [];
  for (let i = 0; i < props.hardwareSets.length; i++) {
    const hardwareSet = props.hardwareSets[i];
    hardwareSets.push(
      <HardwareSet
        name={hardwareSet.name}
        key={hardwareSet.name}
        projectName={props.name}
        checkedOut={hardwareSet.checkedOut}
        availability={hardwareSet.availability}
        userCanModify={props.userHasAccess}
      />
    );
  }

  return (
    <div className={"center-horiz flex-parent outline " + (props.userHasAccess ? "bg-access-yes" : "bg-access-no")}>
      <h2 className="flex-child-2">{props.name}</h2>
      <p className="flex-child-2">{authorizedUsersString}</p>
      <div className="flex-child-4">
        {hardwareSets}
      </div>
      <div className="flex-child-1">
        <Button className="button-fit" variant="contained" onClick={props.onAccessChange}>
          {props.userHasAccess ? "Leave" : "Join"}
        </Button>
      </div>
    </div>
  );
}

// Main projects page
function Projects() {
  // Project array
  const projectArray = [
    {
      name: 'Project Name 1',
      users: ['list', 'of', 'authorized', 'users'],
      hardwareSets: [
        {
          name: 'HWSet1',
          checkedOut: 50,
          availability: 100,
        },
        {
          name: 'HWSet2',
          checkedOut: 0,
          availability: 100,
        },
      ],
    },
    {
      name: 'Project Name 2',
      users: ['list', 'of', 'authorized', 'users'],
      hardwareSets: [
        {
          name: 'HWSet1',
          checkedOut: 50,
          availability: 100,
        },
        {
          name: 'HWSet2',
          checkedOut: 0,
          availability: 100,
        },
      ],
    },
    {
      name: 'Project Name 3',
      users: ['list', 'of', 'authorized', 'users'],
      hardwareSets: [
        {
          name: 'HWSet1',
          checkedOut: 0,
          availability: 100,
        },
        {
          name: 'HWSet2',
          checkedOut: 0,
          availability: 100,
        },
      ],
    },
  ];

  // Stateful behavior: Keep track of which projects the user has access to
  const initialUserAccess = {};
  for (let i = 0; i < projectArray.length; i++) {
    const project = projectArray[i];
    initialUserAccess[project.name] = false;
  }
  initialUserAccess['Project Name 2'] = true;
  const [userAccess, setUserAccess] = useState(initialUserAccess);

  function toggleUserAccess(projectName) {
    fetch(`/api/${projectName}/${userAccess[projectName] ? 'leaveProject' : 'joinProject'}`, {
      method: 'POST',
    })
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        alert(text);
      });

    const update = Object.assign({}, userAccess);
    update[projectName] = !userAccess[projectName];
    setUserAccess(update);
  }

  // Create the render list from the array
  const projectListRender = [];
  for (let i = 0; i < projectArray.length; i++) {
    const project = projectArray[i];
    projectListRender.push(
      <Project
        name={project.name}
        key={project.name}
        users={project.users}
        hardwareSets={project.hardwareSets}
        userHasAccess={userAccess[project.name]}
        onAccessChange={() => toggleUserAccess(project.name)}
      />
    );
  }

  return (
    <>
      <h1>Projects</h1>
      <div>
        {projectListRender}
      </div>
    </>
  );
}

export default Projects;
