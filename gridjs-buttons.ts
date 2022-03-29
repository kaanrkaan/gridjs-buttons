import {PluginBaseComponent, h, PluginBaseProps} from "gridjs";
import {PluginBaseComponentCtor, Plugin} from "gridjs/dist/src/plugin";

interface GridjsButtonsClassList {
    buttonClass?: string,
    addButtonClass?: string,
    editButtonClass?: string,
    deleteButtonClass?: string,
    addIconClass?: string,
    editIconClass?: string,
    deleteIconClass?: string,
}

interface GridjsButtonsEnabledButtons {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
}

interface GridjsButtonsProps {
    classList: GridjsButtonsClassList;
    buttonList: GridjsButtonsEnabledButtons;
    onAdd: Function;
    onEdit: Function;
    onDelete: Function;
    selectId: string;
    maxInputCount: number;
}

export class GridjsButtons extends PluginBaseComponent<
    GridjsButtonsProps & PluginBaseProps<GridjsButtons>
    > {
    // Default Button ClassList
    static defaultClassList: GridjsButtonsClassList = {
        buttonClass: 'btn',
        addButtonClass: 'btn-success',
        editButtonClass: 'btn-info',
        deleteButtonClass: 'btn-danger',
        addIconClass: 'fa-solid fa-plus',
        editIconClass: 'fa-solid fa-pen',
        deleteIconClass: 'fa-solid fa-trash',
    }

    // Default Buttons
    static defaultButtons: GridjsButtonsEnabledButtons = {
        add: true,
        edit: true,
        delete: true
    }

    private checkboxPlugin?: Plugin<PluginBaseComponentCtor> | undefined;

    constructor(
        props: GridjsButtonsProps & PluginBaseProps<GridjsButtons>,
        context: any
    ) {
        super(props, context);

        if (!props.classList) {
            props.classList = GridjsButtons.defaultClassList;
        } else {
            const defaultButtonClassList = Object.keys(GridjsButtons.defaultClassList) as Array<keyof GridjsButtonsClassList>;
            defaultButtonClassList.forEach((key) => {
                if (props.classList[key] === undefined) {
                    props.classList[key] = GridjsButtons.defaultClassList[key];
                }
            });

        }


            // Default button status constructor
        if (!props.buttonList) {
            props.buttonList = GridjsButtons.defaultButtons;
        } else {
            const defaultButtonKeys = Object.keys(GridjsButtons.defaultButtons) as Array<keyof GridjsButtonsEnabledButtons>;
            defaultButtonKeys.forEach((key) => {
                if (props.buttonList[key] === undefined) {
                    props.buttonList[key] = GridjsButtons.defaultButtons[key];
                }
            });
        }

        // Function checker
        if (props.buttonList.add && props.onAdd === undefined) {
            console.error('You forgot to add onAdd hook to the props!')
        }

        if (props.buttonList.edit && props.onEdit === undefined) {
            console.error('You forgot to add onEdit hook to the function props!');
        }

        if (props.buttonList.delete && props.onDelete === undefined) {
            console.error('You forgot to add onDelete hook to the function props!')
        }

        if (props.selectId === undefined) {
            props.selectId = 'selectRow';
        }

        if (props.maxInputCount === undefined) {
            props.maxInputCount = 1;
        }
    }

    componentDidMount() {
        this.checkboxPlugin = this.config.plugin.get(this.props.selectId) ?? undefined;

        if (this.checkboxPlugin === undefined) {
            console.error('current selectId '+ this.props.selectId + ' not found. ');
            return;
        }
        this.state = {
            selectedRows: []
        };

        const grid = this.config.instance;
        const maxInputCount = this.props.maxInputCount;

        grid.on('ready', () => {
            this.checkboxPlugin?.props?.store.on('updated', (state: any) => {
                const arrayRowIds: Array<number> = state.rowIds;

                console.log(grid);
                if (arrayRowIds.length > maxInputCount) {
                    // @ts-ignore
                    console.log(this.checkboxPlugin)
                    //@ts-ignore
                    console.log(this.config.instance.plugin.list()[0])

                }
            });
        });
    }

    render() {
        const addButton = h(
            'button',
            {
                className: 'btn btn-success',
                onClick: event => {
                    event.preventDefault();
                    console.log();
                    this.checkboxPlugin?.props?.store.on('updated', function (state: any, prevState: any) {
                        console.log(state, prevState);
                    });
                    this.props.onAdd();
                }
            },
            h(
                'i',
                {
                    className: 'fa-solid fa-plus'
                }
            )
        );

        const editButton = h(
            'button',
            {
                className: 'btn btn-info',
                onClick: event => {
                    event.preventDefault();

                    // @ts-ignore
                    const checkboxPlugin = this.config.plugin.get(this.props.selectId) ?? undefined;
                    // @ts-ignore
                    const test = checkboxPlugin.props.store;
                    console.log(test);
                    this.props.onEdit();
                }
            },
            h(
                'i',
                {
                    className: 'fa-solid fa-pen'
                }
            )
        );
        const deleteButton = h(
            'button',
            {
                className: 'btn btn-danger ml-2',
                onClick: event => {
                    event.preventDefault();
                    this.props.onDelete();
                }
            },
            h(
                'i',
                {
                    className: 'fa-solid fa-trash'
                }
            )
        )

        const leftButtons = h(
            'div',
            {
                className: 'left-buttons float-left'
            },
            [
                addButton
            ]
        );
        const rightButtons = h(
            'div',
            {
                className: 'right-buttons float-right'
            },
            [
                editButton,
                deleteButton,
                h('h1', {}, '')
            ]
        );

        return h(
            'div',
            {class: 'gridjs-buttons'},
            [
                leftButtons,
                rightButtons
            ]
        )
    }
}
