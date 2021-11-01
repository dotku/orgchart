let orgChart = new Map();

add(10, "SG");
add(7, "DM", 10);
add(71, "DM2", 10);
add(34, "LG", 71);
print();
// remove(71);
print();

function employee(employeeId, name, managerId) {
  return {
    employeeId,
    name,
    managerId
  }
}

function move(employeeId, newManagerId) {
  let managerItem = orgChart.get(newManagerId);
  managerItem.children.add(employeeId);
  orgChart.forEach(item => {
    if (
      item.employeeId !== newManagerId && 
      item.children.has(employeeId) 
    ) {
      item.children.delete(employeeId);
    }
  })
}

function add(employeeId, name, managerId) {
  const newEmployee = new employee(employeeId, name, managerId);
  orgChart.set(employeeId, newEmployee);
}

function count(employeeId) {
  return orgChart.size();
}

function remove(employeeId) {
  orgChart.delete(employeeId);
  cleanChildren();
}

function writeLine(str) {
  // ws.write(str+ "\n");
  console.log(str + "\n");
}

function print() {
  const historyIds = new Set();
  cleanChildren();
  console.log(orgChart);
  orgChart.forEach(item => {
    // console.log(`${item.name}[${item.employeeId}]`);
    // console.log('historyIds', historyIds);
    if (!historyIds.has(item.employeeId)) {
      // if (item.children) {
      //   historyIds.add(...item.children);
      //   console.log(printChildren(item, historyIds));
      // } else {
      //   console.log(`${item.name}[${item.employeeId}]`);
      // }
      console.log(printChildren(item, historyIds));
      historyIds.add(item.employeeId);
    }
  })
}

function printChildren(item, historyIds) {
  if (!item.children) {
    return `${item.name}[${item.employeeId}]`;
  } else {
    historyIds.add(...item.children);
    result = `${item.name}[${item.employeeId}]\n  `;
    item.children.forEach(child => {
      const childItem = orgChart.get(child);
      result += printChildren(childItem, historyIds);
    })
    return result;
  }
}

function cleanChildren() {
  orgChart.forEach(item => {
    let managerItem = null;
    if (item.managerId) {
      managerItem = orgChart.get(item.managerId);
    }
    if (managerItem) {
      if (!managerItem.children) {
        managerItem.children = new Set([item.employeeId]);
      } else if (!managerItem.children.has(item.employeeId)) {
        managerItem.children.add(item.employeeId)
      }
    }
    // clean up children
    if (item.children) {
      console.log('clean up children');
      item.children.forEach(childId => {
        if (!orgChart.has(childId)) {
          item.children.delete(childId);
        }
      })
    }
  });
}