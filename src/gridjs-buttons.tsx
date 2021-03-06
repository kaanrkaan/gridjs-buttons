import {PluginBaseComponent, h, PluginBaseProps} from "gridjs";
import {PluginBaseComponentCtor, Plugin} from "gridjs/dist/src/plugin";
import { GridjsButtonsClassList, GridjsButtonsEnabledButtons, GridjsButtonsProps } from './gridjs-buttons.interface';

export class GridjsButtons extends PluginBaseComponent<
    GridjsButtonsProps & PluginBaseProps<GridjsButtons>
    > {
    // Default Button ClassList
    static defaultClassList: GridjsButtonsClassList = {
        buttonClass: 'btn',
        addButtonClass: 'btn-success',
        editButtonClass: 'btn-info',
        deleteButtonClass: 'btn-danger ml-2',
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

    private readonly classList: GridjsButtonsClassList;
    private readonly buttonList: GridjsButtonsEnabledButtons;

    constructor(
        props: GridjsButtonsProps & PluginBaseProps<GridjsButtons>,
        context: any
    ) {
        super(props, context);

        // Init default
        this.classList = GridjsButtons.defaultClassList;
        this.buttonList = GridjsButtons.defaultButtons;

        // Default class list constructor
        if (props.classList) {
            const defaultButtonClassList = Object.keys(GridjsButtons.defaultClassList) as Array<keyof GridjsButtonsClassList>;
            defaultButtonClassList.forEach((key) => {
                if (props.classList[key] !== undefined) {
                    this.classList[key] = props.classList[key];
                }
            });
        }

        // Default button status constructor
        if (props.buttonList) {
            const defaultButtonKeys = Object.keys(GridjsButtons.defaultButtons) as Array<keyof GridjsButtonsEnabledButtons>;
            defaultButtonKeys.forEach((key) => {
                if (props.buttonList[key] !== undefined) {
                    this.buttonList[key] = props.buttonList[key];
                }
            });
        }

        // Function checker
        if (this.buttonList.add && props.onAdd === undefined) {
            console.error('You forgot to add onAdd hook to the props!')
        }

        if (this.buttonList.edit && props.onEdit === undefined) {
            console.error('You forgot to add onEdit hook to the function props!');
        }

        if (this.buttonList.delete && props.onDelete === undefined) {
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
            // Listen update event
            this.checkboxPlugin?.props?.store.on('updated', (state: any) => {
                const arrayRowIds: Array<number> = state.rowIds;

                if (arrayRowIds.length > maxInputCount) {
                    // Get the last column ID
                    const lastId = arrayRowIds[arrayRowIds.length - 1];

                    // Send UNCHECK
                    this.config.pipeline.process().then(() => {
                        this.config.dispatcher.dispatch({
                            type: 'UNCHECK',
                            payload: {
                                ROW_ID: lastId
                            }
                        });
                    });
                }
            });
        });
    }

    render() {
        return (
            <div className={'gridjs-buttons'}>
                <div className={'left-buttons float-left'}>
                    {
                        this.buttonList.add
                        &&
                        <button
                            className={this.classList.buttonClass + ' ' + this.classList.addButtonClass}
                            onClick={
                                (event) => {
                                    event.preventDefault();
                                    this.props.onAdd(this.checkboxPlugin.props?.store.state['rowIds']);
                                }
                            }
                        >
                            <i className={this.classList.addIconClass}/>
                        </button>
                    }
                </div>
                <div className={'right-buttons float-right'}>
                    {
                        this.buttonList.edit
                        &&
                        <button
                            className={this.classList.buttonClass + ' ' + this.classList.editButtonClass}
                            onClick={
                                (event) => {
                                    event.preventDefault();
                                    this.props.onEdit(this.checkboxPlugin.props?.store.state['rowIds']);
                                }
                            }
                        >
                            <i className={this.classList.editIconClass}/>
                        </button>
                    }
                    {
                        this.buttonList.delete
                        &&
                        <button
                            className={this.classList.buttonClass + ' ' + this.classList.deleteButtonClass}
                            onClick={
                                (event) => {
                                    event.preventDefault();
                                    this.props.onDelete(this.checkboxPlugin.props?.store.state['rowIds']);
                                }
                            }
                        >
                            <i className={this.classList.deleteIconClass}/>
                        </button>
                    }
                </div>
            </div>
        );
    }
}
