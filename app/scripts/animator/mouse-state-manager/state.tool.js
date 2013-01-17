define(['animator/mouse-state-manager/mouse-state', 'animator/mouse-state-manager/state.tool.edit', 'animator/mouse-state-manager/state.tool.pencil', 'animator/mouse-state-manager/state.tool.select', 'animator/mouse-state-manager/state.tool.boxselect', 'animator/mouse-state-manager/state.tool.brush'], function(MouseState, StateToolEdit, StateToolPencil, StateToolSelect, StateToolBoxSelect, StateToolBrush) {
    return MouseState.extend({
        pencil: StateToolPencil.create(),
        edit: StateToolEdit.create(),
        select: StateToolSelect.create(),
        brush: StateToolBrush.create(),
        boxselect: StateToolBoxSelect.create()
    });
});
