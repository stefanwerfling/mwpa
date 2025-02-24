import {FormGroup, FormRow, LangText, ModalDialog, ModalDialogType, Textarea} from 'bambooo';

/**
 * Sighting deleted modal dialog.
 */
export class SightingDeletedModal extends ModalDialog {

    /**
     * ID of entry.
     * @member {number|null}
     */
    protected _id: number|null = null;

    /**
     * Description, why a user deletes this sighting.
     * @member {Textarea}
     */
    protected _descriptionArea: Textarea;

    /**
     * Constructor from Dialog.
     * @param {Element} elementObject
     */
    public constructor(elementObject: Element) {
        super(elementObject, 'sightingdeletemodaldialog', ModalDialogType.large);

        const bodyCard = jQuery('<div class="card-body"/>').appendTo(this._body);

        const rowFirst = new FormRow(bodyCard);
        const groupDesc = new FormGroup(rowFirst.createCol(6), 'Are you sure you want to delete the sighting? Please describe:');
        this._descriptionArea = new Textarea(groupDesc);

        // buttons -----------------------------------------------------------------------------------------------------

        this.addButtonClose(new LangText('Close'));
        this.addButtonSave(new LangText('Save changes'), true);
    }

    /**
     * getId
     */
    public getId(): number|null {
        return this._id;
    }

    /**
     * Set the ID of entry.
     * @param {number|null} id - ID of entry.
     */
    public setId(id: number|null): void {
        this._id = id;
    }

    /**
     * Return the description by textarea input.
     * @returns {string}
     */
    public getDescription(): string {
        return this._descriptionArea.getValue();
    }

    /**
     * Set the description to textarea.
     * @param {string} description
     */
    public setDescription(description: string): void {
        this._descriptionArea.setValue(description);
    }

    /**
     * resetValues
     */
    public override resetValues(): void {
        this.setId(null);
        this.setDescription('');
    }

}