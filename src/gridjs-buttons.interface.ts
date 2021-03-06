export interface GridjsReturnFunction {
    (rowIds: Array<any>): void;
}

export interface GridjsButtonsClassList {
    buttonClass?: string,
    addButtonClass?: string,
    editButtonClass?: string,
    deleteButtonClass?: string,
    addIconClass?: string,
    editIconClass?: string,
    deleteIconClass?: string,
}

export interface GridjsButtonsEnabledButtons {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
}

export interface GridjsButtonsProps {
    classList?: GridjsButtonsClassList;
    buttonList?: GridjsButtonsEnabledButtons;
    onAdd?: GridjsReturnFunction;
    onEdit?: GridjsReturnFunction;
    onDelete?: GridjsReturnFunction;
    selectId?: string;
    maxInputCount?: number;
}