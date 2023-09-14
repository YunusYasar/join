/**
 * Generates the HTML for the edit contact modal.
 *
 * @param {Object} contact - The contact object to be edited.
 * @param {number} i - Index of the contact in the contact list.
 * @returns {string} - HTML string for the edit contact modal.
 */
function editContactModalHTML(contact, i) {
  return `
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

/**
 * Generates the HTML for displaying the current contact.
 *
 * @param {Object} contact - The contact object to be displayed.
 * @param {number} i - Index of the contact in the contact list.
 * @returns {string} - HTML string for the current contact.
 */
function currentContactHTML(contact, i) {
  return `
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

/**
 * Generates the HTML for displaying assigned contacts.
 *
 * @param {Object} contact - The contact object to be displayed.
 * @param {string} initials - Initials of the contact's name.
 * @param {number} index - Index of the contact in the contact list.
 * @param {boolean} isChecked - Determines whether the contact checkbox is checked or not.
 * @returns {string} - HTML string for the assigned contact.
 */
function appendAssignedContactHTML(contact, initials, index, isChecked) {
  return `
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

/**
 * Generates the HTML for displaying a to-do task.
 *
 * @param {Object} task - The task object to be displayed.
 * @param {number} index - Index of the task in the task list.
 * @returns {string} - HTML string for the to-do task.
 */
function generateToDoHTML(task, index) {
  let categoryMatched = categories.find(cat => cat.name === task.category);
  let categoryColor = categoryMatched.color || '#FFFFFF';
  let contactHTML = '';
  if (task.contacts) {
    task.contacts.forEach(contact => {
      contactHTML += `<span style="background-color: ${contact.color}" class="assigned-to-display">${getInitials(contact.name)}</span>`;
    });
  }
  return /*html*/ `
      <div onclick="openTask(${index})" class="task" draggable="true" ondragstart="startDragging('${index}')">
        <span style="background-color: ${categoryColor}" class="task-category">${task.category}</span>
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

/**
 * Generates the HTML for displaying the modal of a to-do task.
 *
 * @param {Object} task - The task object to be displayed in modal.
 * @param {number} index - Index of the task in the task list.
 * @returns {string} - HTML string for the to-do modal.
 */
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

/**
 * Generates the HTML for editing a to-do task inside a modal.
 *
 * @param {Object} task - The task object to be edited.
 * @param {number} index - Index of the task in the task list.
 * @returns {string} - HTML string for the edit task modal.
 */
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
            <img onclick="editTaskModal(${index})" class="overlay-close-button" src="../assets/img/x-icon.svg" alt="X">

            <button onclick="saveEditedTask(${index});" class="button-with-icon edit-submit-task-button" >
              OK
              <img src="../assets/img/checkmark-icon.svg" alt="">
            </button>
          </form>
          </div>
        `;
}

/**
 * Generates and returns the HTML for a subtask progress bar.
 * @param {Array} subtasks - The list of subtasks.
 * @param {number} subtaskPercent - The percentage of completed subtasks.
 * @param {number} completedSubtasks - The count of completed subtasks.
 * @returns {string} The HTML for the progress bar.
 */
function getProgressBarHTML(subtasks, subtaskPercent, completedSubtasks) {
  return /*html*/ `
    <div class="progress-bar-box">
    <div style="width: ${subtaskPercent}%;" class="progress-bar-bar"></div>
    </div>
    <div class="subtask-text-box">
    <span>${completedSubtasks}/${subtasks.length}</span> 
    <span>Done</span>
    </div>
  `;
}

/**
 * Generates and returns the HTML for an open subtask.
 * @param {number} taskIndex - The index of the parent task.
 * @param {Object} subtask - The subtask object.
 * @param {string} functionName - The name of the function to call on change.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The generated HTML.
 */
function getSubtaskOpenHTML(taskIndex, subtask, functionName, index) {
  return /*html*/ `
    <label onchange="${functionName}(${taskIndex}, ${index})"><input id="overlayCheckbox${index}" type="checkbox"> ${subtask.name}</label>
  `;
}

/**
 * Generates and returns the HTML for a closed subtask.
 * @param {number} taskIndex - The index of the parent task.
 * @param {Object} subtask - The subtask object.
 * @param {string} functionName - The name of the function to call on change.
 * @param {number} index - The index of the subtask.
 * @returns {string} - The generated HTML.
 */
function getSubtaskClosedHTML(taskIndex, subtask, functionName, index) {
  return /*html*/ `
    <label onchange="${functionName}(${taskIndex}, ${index})"><input id="overlayCheckbox${index}" checked  type="checkbox"> ${subtask.name}</label>
  `;
}

/**
 * Returns an HTML template for creating a new category.
 * @returns {string} An HTML template for the new category input form.
 */
function getCreateNewCategoryHTML() {
  return /*html*/ `
      <input placeholder="New category name" class="input-new-category" id="category-input" onclick="noClose(event)" type="text"/>
      <div class="add-category-img-box">
        <img onclick="clearInput('category-input')" class="subtask-img" src="../assets/img/cancel-icon.svg" alt=""/>
      <div class="seperator-small"></div>
        <img onclick="addNewCategory()" class="subtask-img" src="../assets/img/checkmark-icon-black.svg" alt=""/>
      </div>
  `;
}

/**
 * Returns an HTML representation of a color for the color picker.
 * @param {string} color - The color code.
 * @param {number} index - The index of the color in the categoryColors array.
 * @returns {string} An HTML representation of the color.
 */
function getColorHTML(color, index) {
  return /*html*/ `
     <div id="color${index}" onclick="selectColor('${color}', 'color${index}')" class="color-picker-color" style="background-color: ${color}"></div>
  `;
}

/**
 * Generates HTML for a given subtask.
 * @param {Object} subtask - The subtask object.
 * @param {number} i - Index of the subtask.
 * @param {Object} [task=null] - The task object, if available.
 * @param {string} targetDivId - The ID of the target container.
 * @returns {string} - Returns the generated HTML string.
 */
function getSubtaskHTML(subtask, i, task = null, targetDivId) {
  let subtaskName = task ? subtask.name : subtask.name;
  return /*html*/ `
    <div class="subtasks-content">
      <span>
        - ${subtaskName}
      </span>
      <img onclick="deleteSubtask(${i},'${targetDivId}')" class="subtask-img" src="../assets/img/delete.svg" alt="" />
    </div> 
    `;
}
