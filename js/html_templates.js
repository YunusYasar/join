function editContactModalHTML(contact, i) {
  return /*html*/ `
    <div onclick="noClose(event)" id="editContact" class="modal-inner-container">
     <div class="left-frame-add">
       <img src="../assets/img/logo_Light.png" alt="Join logo">
       <div class="contact-info">
         <h1>Edit contact</h1>
       </div>
     </div>
     <div class="right-frame-add">
        <div class="img-wrapper" style="background-color: ${contact.color}">
          ${contact.initials} 
        </div>
       <form class="user-form" id="editContactForm" onsubmit="updateContact(${i}); return false;">
         <input type="hidden" id="editingIndex">
         <div class="input-wrapper">
           <input id="editContactName" required type="text" placeholder="Name">
           <img src="../assets/img/user-icon.svg" alt="">
         </div>
         <div class="input-wrapper">
           <input id="editContactEmail" required type="email" placeholder="Email">
           <img src="../assets/img/login-email.svg" alt="">
         </div>
         <div class="input-wrapper">
           <input id="editContactPhone" required type="number" placeholder="Phone">
           <img src="../assets/img/telephone.svg" alt="">
         </div>
         <div class="button-wrapper">
           <button onclick="deleteContact(${i})" type="reset" class="button-secondary-with-icon">
            <span>Delete</span>
             <img src="../assets/img/cancel-icon.svg" alt="">
           </button>
           <button class="button-with-icon">
             <span>Save</span>
             <img src="../assets/img/checkmark-icon.svg" alt="">
           </button>
         </div>
       </form>
    </div>
    </div>
    `;
}

function currentContactHTML(contact, i) {
  return /*html*/ `
  <div>
  <div class="contact-head">
    <div class="img-wrapper" style="background-color: ${contact.color}">
        ${contact.initials} 
    </div>
    <h3>${contact.name}</h3>
  </div>
    <div>
    <div class="contact-underline">
        <span>Contact Information</span>
        <div class="currentAction">
        <span class="edit-contact" onclick="deleteContact(${i})">
            <img class="pencil-img" src="../assets/img/delete.svg" alt="">
            Delete
        </span>
        <span class="edit-contact" onclick="editContactModal(${i})">
            <img class="pencil-img" src="../assets/img/edit.svg" alt="">
            Edit Contact
        </span>
        </div>
    </div>
    </div>
    <div class="contact-parts">
        <div class="bold">Email</div>
        <a href="mailto:${contact.email}">${contact.email}</a>
    </div>
    <div class="contact-parts">
        <div class="bold">Phone</div>
        <a href="tel:${contact.phone}">${contact.phone}</a>
    </div>
  </div>`;
}

function appendAssignedContactHTML(contact, initials, index, isChecked) {
  return /*html*/ `
      <div class="contact-card-assigned">
              <div class="contact-avatar-assigned" style="background-color: ${contact.color}">
                  <span>${initials}</span>
              </div>
              <div class="assigned-contact-choice">
                  <label class="contact-name">${contact.name}
                  <input type="checkbox" class="assigned-checkbox" value="${index}" ${isChecked}>
                  </label>
              </div>
          </div>
      `;
}

function generateToDoHTML(task, index) {
  let contactHTML = '';
  if (task.contacts) {
    task.contacts.forEach(contact => {
      contactHTML += `<span style="background-color: ${contact.color}" class="assigned-to-display">${getInitials(contact.name)}</span>`;
    });
  }
  return /*html*/ `
    <div onclick="openTask(${index})" class="task" draggable="true" ondragstart="startDragging('${index}')">
    <span style="background-color: ${categories.find(cat => cat.name === task.category).color}" class="task-category">${task.category}</span>
      <div class="arrow-div">
       <img onclick="noClose(event), changeStatusMobile(${index}, '${task.status}', 'previous')" 
           style="transform: rotate(90deg);" 
           class="arraw-task ${task.status === 'toDo' ? 'd-none' : ''}" 
           src="../assets/img/arrow-left.svg" alt="">
  
       <img onclick="noClose(event), changeStatusMobile(${index}, '${task.status}', 'next')" 
           style="transform: rotate(-90deg);" 
           class="arraw-task ${task.status === 'done' ? 'd-none' : ''}" 
           src="../assets/img/arrow-left.svg" alt="">
      </div>  
      <div class="task-title-description-box">
            <b>${task.title}</b>
            <p>${task.description}</p>
      </div>
      <div id="subtask-box-progress-bar-${index}" class="subtask-box">         
    </div>
    <div class="assign-and-prio-box">
      <div class="assigned-to-overview-box" id="overview-assigned-to-box${index}">
          ${contactHTML}
      </div>
      <div class="task-prio-box">
        <img src="../assets/img/${task.priority}-prio-icon-small.svg" alt="" />
      </div>
    </div>
  </div>
      `;
}

function generateToDoModalHTML(task, index) {
  let contactHTML = '';
  if (task.contacts) {
    task.contacts.forEach(contact => {
      contactHTML += `<div class="todo-modal-open-card"><span style="background-color: ${contact.color}" class="assigned-to-display">${getInitials(contact.name)}</span>
          <span>${contact.name}</span></div>`;
    });
  }
  return /*html*/ `
        <div>
        <input type="hidden" id="editingShowTaskIndex">
          <span style="background-color: ${categories.find(cat => cat.name === task.category).color}" class="task-category">${task.category}</span>
          <b class="overlay-headline">${task.title}</b>
          <p>${task.description}</p>
          <div class="overlay-due-date">
            <b>Due date:</b>
            <span>${task.dueDate}</span>
          </div>
          <div class="overlay-prio">
            <b>Priority:</b>
            <div id="overlayPrioBox">
              <div class="overview-prio-box ${task.priority}">
              <span>${capitalizeFirstLetter(task.priority)}</span>
                <img src="../assets/img/${task.priority}-prio-white-icon-small.svg" alt="">
              </div>
            </div>
          </div>
          <b>Assigned To:</b>
          <div id="assigned-to-box">
          <div class="assigned-to-overview-box" id="overview-assigned-to-box${index}">
             <div>
                ${contactHTML} 
             </div> 
            </div>
          </div>
          <div id="subtaskBoxWrapper" class="add-task-overlay-input-box">
            <b>Subtasks:</b>
            <div id="subtask-box-overlay">
              
            </div>
          </div>
          <img onclick="openTask(${index})" class="overlay-close-button" src="../assets/img/x-icon.svg" alt="X">
          <div class="open-task-underline">
          <span class="delete-edit-task" onclick="deleteTask(${index})">
              <img src="../assets/img/delete.svg" alt="">
              Delete
          </span>
          <span class="delete-edit-task" onclick="editTaskModal(${index})">
              <img src="../assets/img/edit.svg" alt="">
              Edit
          </span>
          </div>
        </div>
      `;
}

function editTaskModalHTML(task, index) {
  const urgentHighlight = task.priority === 'urgent' ? '' : 'd-none';
  const mediumHighlight = task.priority === 'medium' ? '' : 'd-none';
  const lowHighlight = task.priority === 'low' ? '' : 'd-none';

  return /*html*/ `
        <div onclick="noClose(event)" id="editTaskInModal" class="modal-inner-container add-task-modal task-in-modal">
        
        <form onsubmit=" return false;" class="add-task-form add-form-overlay edit-task-form">
          <input type="hidden" id="editingTaskIndex">
          <div class="input-box">
            <label for="edit-title">Title</label>
            <input type="text" id="edit-title" value="${task.title}">
          </div>
          <div class="input-box">
            <label for="edit-description">Description</label>
            <textarea id="edit-description">${task.description}</textarea>
          </div>
          <div class="input-box date-box">
            <label for="due-date">Due date</label>
            <input required onclick="setMinDate()" type="date" name="due-date" id="edit-due-date" value="${task.dueDate}">
          </div>
          <!-- Priority edit section -->
          <div id="prio-box-wrapper" class="input-box">
            <label for="edit-prio">Prio</label>
              <div id="prio-box">
                <div id="edit-urgent-prio-box" onclick="setEditPrio('urgent')">
                  <span>Urgent</span>
                  <img src="../assets/img/urgent-prio-icon-small.svg" alt="urgent-prio" />
                  <img class="white-icon ${urgentHighlight}" src="../assets/img/urgent-prio-white-icon-small.svg" alt="urgent-prio" />
                </div>
                <div id="edit-medium-prio-box" onclick="setEditPrio('medium')">
                  <span>Medium</span>
                  <img src="../assets/img/medium-prio-icon-small.svg" alt="medium-prio" />
                  <img class="white-icon ${mediumHighlight}" src="../assets/img/medium-prio-white-icon-small.svg" alt="medium-prio" />
                </div>
                <div id="edit-low-prio-box" onclick="setEditPrio('low')">
                  <span>Low</span>
                  <img src="../assets/img/low-prio-icon-small.svg" alt="low-prio" />
                  <img class="white-icon ${lowHighlight}" src="../assets/img/low-prio-white-icon-small.svg" alt="low-prio" />
                </div>
              </div>
              <div id="errorTagPrio" class="error-msg-task d-none">Please select a priority</div>
          </div>
          <div id="add-task-assigned-to-box" class="input-box">
            <span class="label">Assigned to</span>
            <div class="dropdown" onclick="toggleDropdownEditContacts()" id="assignedContactsList">
              <span id="selectedEditCategory">Select contacts to assign</span>
              <div class="dropdown-content-contacts edit-contacts-dropdown" id="dropdownContentEditContacts"></div>
              <img class="open-arrow" src="../assets/img/open-select-arrow.svg" alt="arrow-down" />
            </div>
          </div>
          <div id="subtask-box-wrapper" class="input-box">
            <label for="subtask-input">Subtasks</label>
            <div class="input-with-icons">
              <input placeholder="Add new subtask" id="subtask-input-edit" type="text" name="subtask-input" />
              <div class="input-icon-box">
                <img onclick="clearInput('subtask-input-edit')" class="subtask-img" src="../assets/img/cancel-icon.svg" alt="" />
                <div class="seperator-small"></div>
                <img onclick="addSubtask('subtask-edit-box')" class="subtask-img" src="../assets/img/checkmark-icon-black.svg" alt="" />
              </div>
            </div>
        
            <div id="subtask-edit-box"></div>
  
             
          </div>
          <button onclick="saveEditedTask(${index});" class="button-with-icon edit-submit-task-button" >
            OK
            <img src="../assets/img/checkmark-icon.svg" alt="">
          </button>
        </form>
        </div>
      `;
}
