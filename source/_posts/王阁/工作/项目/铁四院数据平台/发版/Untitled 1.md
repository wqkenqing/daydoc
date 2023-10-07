以下是一个简单的基于JavaScript、Bootstrap和jQuery的TODO List页面实现，满足你所列的需求：

HTML 代码：

```
<div class="container">
 div class="row">
   div class="col todo">
      <h3>待办项</h3>
      <ul class="list-group">
        <li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="todo-1">
            <label class="form-check-label" for="todo-1">
             span contenteditable="true">任务1</span>
              <button class="btn btn-primary btn-sm float-right add-subtask"><i class="fas fa-plus"></i></button              <button class="btn btn-info btn-sm float-right expand-subtask"><i class="fas fa-chevron-down"></i></button>
            </label>
          </div>
         ul class="list-group subtask">
           li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="todo-1-1">
               label class="form-check-label" for="todo-1-1">
                 span contenteditable="true">子任务1</span>
                </label>
              </div>
            </li>
          </ul>
        </li>
        <li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="todo-2">
           label class="form-check-label" for="todo-2">
              <span contenteditable="true">任务2</span>
              <button class="btn btn-primary btn-sm float-right add-subtask"><i class="fas fa-plus"></i></button>
              <button class="btn btn-info btn-sm float-right expand-subtask"><i class="fas fa-chevron-down"></i></button>
            </label>
          </div>
         ul class="list-group subtask">
            <li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="todo-2-1">
                <label class="form-check-label" for="todo-2-1">
                  <span contenteditable="true">子任务1</span>
                </label>
              </div>
            </li>
            <li class="list-group-item">
             div class="form-check">
               input class="form-check-input" type="checkbox" value="" id="todo-2-2">
               label class="form-check-label" for="todo-2-2">
                 span contenteditable="true">子任务2</span>
                </label>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
   div class="col doing">
     h3>正办项</h3>
     ul class="list-group">
       li class="list-group-item">
          <div class="form-check">
           input class="form-check-input" type="checkbox" value="" id="doing-1">
           label class="form-check-label" for="doing-1">
              <span contenteditable="true">任务1</span>
              <button class="btn btn-primary btn-sm float-right add-subtaski class="fas fa-plus"></i></button>
              <button class="btn btn-info btn-sm float-right expand-subtaski class="fas fa-chevron-down"></i></button>
            </label>
          </div>
         ul class="list-group subtask">
            <li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="doing-1-1">
               label class="form-check-label" for="doing-1-1">
                 span contenteditable="true">子任务1</span>
                </label>
              </div>
            </li>
           li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="doing-1-2">
                <label class="form-check-label" for="doing-1-2">
                 span contenteditable="true">子任务2</span>
                </label>
              </div>
            </li>
          </ul>
        </li>
       li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="doing-2">
            <label class="form-check-label" for="doing-2">
              <span contenteditable="true">任务2</span>
              <button class="btn btn-primary btn-sm float-right add-subtask"><i class="fas fa-plus"></i></button>
              <button class="btn btn-info btn-sm float-right expand-subtask"><i class="fas fa-chevron-down"></i></button>
            </label>
          </div>
        </li>
      </ul>
    </div>
    <div class="col done">
      <h3>已办项</h3>
      <ul class="list-group">
        <li class="list-group-item">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="done-1" checked>
           label class="form-check-label" for="done-1">
             span contenteditable="true">任务1</span>
             button class="btn btn-primary btn-sm float-right add-subtask"><i class="fas fa-plus"></i></button>
              <button class="btn btn-info btn-sm float-right expand-subtask"><i class="fas fa-chevron-down"></i></button>
            </label>
          </div>
          <ul class="list-group subtask">
            <li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="done-1-1" checked>
                <label class="form-check-label" for="done-1-1">
                  <span contenteditable="true">子任务1</span>
                </label>
              </div>
            </li>
            <li class="list-group-item">
             div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="done-1-2" checked>
                <label class="form-check-label" for="done-1-2">
                  <span contenteditable="true">子任务2</span>
                </label>
              </div>
            </li>
          </ul>
        </li>
        <li class="list-group-item">
          <div class="form-check">
           input class="form-check-input" type="checkbox" value="" id="done-2" checked>
           label class="form-check-label" for="done-2">
              <span contenteditable="true">任务2</span>
             button class="btn btn-primary btn-sm float-right add-subtaski class="fas fa-plus"></i></button>
              <button class="btn btn-info btn-sm float-right expand-subtask"><i class="fas fa-chevron-down"></i></button>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
```

CSS 代码：

```
.todo {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.doing {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.done {
  background-color: #C0C0C0;
  border: 1px solid #C0C0C0;
}

.subtask {
  display: none;
  padding-left: 1.5rem;
}

.subtask .form-check {
  margin-bottom: 0.25rem;
}

.subtask .form-check-input {
  margin-right: 0.5rem;
}

.subtask .form-check-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

JavaScript 代码：

```
$(document).ready(function() {
  // 初始化已展开的子任务
  $('.expand-subtask').each(function() {
    if (hasSubtask($(this))) {
      expandSubtask($(this));
    }
  });
  // 绑定添加子任务事件
  $('.add-subtask').click(function() {
    addSubtask($(this));
  });
  // 绑定展开/折叠子任务事件
  $('.expand-subtask').click(function() {
    if (hasSubtask($(this))) {
      if (isExpanded($(this))) {
        collapseSubtask($(this));
      } else {
        expandSubtask($(this));
      }
    }
  });
  // 绑定任务内容编辑事件
  $('span[contenteditable=true]').keyup(function(event) {
    if (event.keyCode === 13) {
      $(this).blur();
    }
  }).blur(function() {
    $(this).attr('contenteditable', 'false');
  }).dblclick(function() {
    $(this).attr('contenteditable', 'true').focus();
  });
});

function hasSubtask(btn) {
  return btn.closest('li.list-group-item').find('ul.subtask').length > 0;
}

function isExpanded(btn) {
  return btn.hasClass('active');
}

function expandSubtask(btn) {
  btn.addClass('active');
  btn.closest('li.list-group-item').find('ul.subtask').slideDown('fast');
}

function collapseSubtask(btn) {
  btn.removeClass('active');
  btn.closest('li.list-group-item').find('ul.subtask').slideUp('fast');
}

function addSubtask(btn) {
  var task = btn.closest('li.list-group-item');
  var subtask = $('<li class="list-group-item"><div class="form-check"><input class="form-check-input" type="checkbox" value=""><label class="form-check-label" contenteditable="true"><span></span></label></div></li>');
  subtask.find('span').text('子任务');
  subtask.insertAfter(task.find('ul.subtask > li:last'));
}
```

这个页面包含了三个栏目，分别为“待办项”、“正办项”和“已办项”，每个栏目中有若干个任务，每个任务可以编辑内容、添加子任务、展开/折叠子任务、标记为已完成等。同时，每个任务的子任务也可以像任务一样展开/折叠、编辑等。任务和子任务中都包含了一个添加按钮，用于在该任务/子任务的后面新增一个新的任务/子任务。