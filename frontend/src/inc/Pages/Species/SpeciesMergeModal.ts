import {FormGroup, LangText, ModalDialog, ModalDialogType, SelectBottemBorderOnly2} from 'bambooo';
import {SpeciesEntry} from '../../Api/Species';

/**
 * SpeciesMergeModal
 */
export class SpeciesMergeModal extends ModalDialog {

    /**
     * specie source select
     * @protected
     */
    protected _specieSourceSelect: SelectBottemBorderOnly2;

    /**
     * specie destination select
     * @protected
     */
    protected _specieDestinationSelect: SelectBottemBorderOnly2;

    /**
     * constructor
     * @param elementObject
     */
    public constructor(elementObject: Element) {
        super(elementObject, 'speciesmergemodaldialog', ModalDialogType.large);

        const bodyCard = jQuery('<div class="card-body"/>').appendTo(this._body);

        const groupSrcSpecie = new FormGroup(bodyCard, 'Specie source');
        this._specieSourceSelect = new SelectBottemBorderOnly2(groupSrcSpecie);

        const groupDstSpecie = new FormGroup(bodyCard, 'Specie destination');
        this._specieDestinationSelect = new SelectBottemBorderOnly2(groupDstSpecie);

        // buttons -----------------------------------------------------------------------------------------------------

        this.addButtonClose(new LangText('Close'));
        this.addButtonSave(new LangText('Save changes'), true);
    }

    /**
     * setSpecies
     * @param species
     */
    public setSpecies(species: SpeciesEntry[]): void {
        this._specieSourceSelect.clearValues();
        this._specieDestinationSelect.clearValues();

        this._specieSourceSelect.addValue({
            key: '0',
            value: '*Please select a specie*'
        });

        this._specieDestinationSelect.addValue({
            key: '0',
            value: '*Please select a specie*'
        });

        for (const specie of species) {
            const toption = {
                key: `${specie.id}`,
                value: `#${specie.id} - ${specie.name}`
            };

            this._specieSourceSelect.addValue(toption);
            this._specieDestinationSelect.addValue(toption);
        }
    }

    /**
     * setSourceSpecie
     * @param specieId
     */
    public setSourceSpecie(specieId: string): void {
        this._specieSourceSelect.setSelectedValue(specieId);
    }

    /**
     * getSourceSpecie
     */
    public getSourceSpecie(): string {
        return this._specieSourceSelect.getSelectedValue();
    }

    /**
     * setDestinationSpecie
     * @param {string} specieId
     */
    public setDestinationSpecie(specieId: string): void {
        this._specieDestinationSelect.setSelectedValue(specieId);
    }

    /**
     * getDestinationSpecie
     */
    public getDestinationSpecie(): string {
        return this._specieDestinationSelect.getSelectedValue();
    }

    /**
     * resetValues
     */
    public override resetValues(): void {
        this._specieSourceSelect.setSelectedValue('0');
        this._specieDestinationSelect.setSelectedValue('0');
    }

}