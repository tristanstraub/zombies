define(['reanimator/mouse-state-manager/mouse-state', 'reanimator/mouse-state-manager/state.tool.edit', 'reanimator/mouse-state-manager/state.tool.pencil', 'reanimator/mouse-state-manager/state.tool.select', 'reanimator/mouse-state-manager/state.tool.boxselect', 'reanimator/mouse-state-manager/state.tool.brush'], function(MouseState, StateToolEdit, StateToolPencil, StateToolSelect, StateToolBoxSelect, StateToolBrush) {
    return MouseState.extend({
        pencil: new StateToolPencil(),
        edit: new StateToolEdit(),
        select: new StateToolSelect(),
        brush: new StateToolBrush(),
        boxselect: new StateToolBoxSelect()
    });
});
