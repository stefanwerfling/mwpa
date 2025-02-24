import {
    FormGroup, FormRow,
    InputBottemBorderOnly2, InputType, LangText,
    ModalDialog,
    ModalDialogType,
    SelectBottemBorderOnly2,
    Switch
} from 'bambooo';
import {GroupEntry} from '../../Api/Group';

/**
 * UsersEditModal
 */
export class UsersEditModal extends ModalDialog {

    /**
     * id of entry
     * @protected
     */
    protected _id: number|null = null;

    /**
     * input Username
     * @protected
     */
    protected _inputUsername: InputBottemBorderOnly2;

    /**
     * input Fullname
     * @protected
     */
    protected _inputFullname: InputBottemBorderOnly2;

    /**
     * input password
     * @protected
     */
    protected _inputPassword: InputBottemBorderOnly2;

    /**
     * input password repeat
     * @protected
     */
    protected _inputPasswordRepeat: InputBottemBorderOnly2;

    /**
     * input pin repeat
     * @protected
     */
    protected _inputPin: InputBottemBorderOnly2;

    /**
     * input pin repeat
     * @protected
     */
    protected _inputPinRepeat: InputBottemBorderOnly2;

    /**
     * input EMail
     * @protected
     */
    protected _inputEMail: InputBottemBorderOnly2;

    /**
     * select main group
     * @protected
     */
    protected _selectMainGroup: SelectBottemBorderOnly2;

    /**
     * switch is admin
     * @protected
     */
    protected _switchIsAdmin: Switch;

    /**
     * switch is disabled
     * @protected
     */
    protected _switchIsDisabled: Switch;

    /**
     * constructor
     * @param elementObject
     */
    public constructor(elementObject: Element) {
        super(elementObject, 'usersmodaldialog', ModalDialogType.large);

        const bodyCard = jQuery('<div class="card-body"/>').appendTo(this._body);

        const groupUsername = new FormGroup(bodyCard, 'Username');
        this._inputUsername = new InputBottemBorderOnly2(groupUsername);
        this._inputUsername.setPlaceholder('Name of user');

        const groupFullname = new FormGroup(bodyCard, 'Fullname');
        this._inputFullname = new InputBottemBorderOnly2(groupFullname);
        this._inputFullname.setPlaceholder('Fullname of user');

        const groupPassword = new FormGroup(bodyCard, 'Password');
        this._inputPassword = new InputBottemBorderOnly2(groupPassword, undefined, InputType.password);
        this._inputPassword.setPlaceholder('');

        const groupPasswordRepeat = new FormGroup(bodyCard, 'Password repeat');
        this._inputPasswordRepeat = new InputBottemBorderOnly2(groupPasswordRepeat, undefined, InputType.password);
        this._inputPasswordRepeat.setPlaceholder('');

        const groupPing = new FormGroup(bodyCard, 'Pin');
        this._inputPin = new InputBottemBorderOnly2(groupPing, undefined, InputType.password);
        this._inputPin.setPlaceholder('');

        const groupPinRepeat = new FormGroup(bodyCard, 'Pin repeat');
        this._inputPinRepeat = new InputBottemBorderOnly2(groupPinRepeat, undefined, InputType.password);
        this._inputPinRepeat.setPlaceholder('');

        const groupEMail = new FormGroup(bodyCard, 'EMail');
        this._inputEMail = new InputBottemBorderOnly2(groupEMail);
        this._inputEMail.setPlaceholder('e@mail.org');

        const groupMainGroup = new FormGroup(bodyCard, 'Main group');
        this._selectMainGroup = new SelectBottemBorderOnly2(groupMainGroup);

        const rowOpt = new FormRow(bodyCard);

        const groupIsAdmin = new FormGroup(rowOpt.createCol(4), 'Is Admin');
        this._switchIsAdmin = new Switch(groupIsAdmin, 'userisadmin');

        const groupIsDisabled = new FormGroup(rowOpt.createCol(4), 'Is Disabled');
        this._switchIsDisabled = new Switch(groupIsDisabled, 'userisdisabled');

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
     * setId
     * @param id
     */
    public setId(id: number|null): void {
        this._id = id;
    }

    /**
     * getUsername
     */
    public getUsername(): string {
        return this._inputUsername.getValue();
    }

    /**
     * setUsername
     * @param username
     */
    public setUsername(username: string): void {
        this._inputUsername.setValue(username);
    }

    /**
     * getFullname
     */
    public getFullname(): string {
        return this._inputFullname.getValue();
    }

    /**
     * setFullname
     * @param fullname
     */
    public setFullname(fullname: string): void {
        this._inputFullname.setValue(fullname);
    }

    /**
     * getPassword
     */
    public getPassword(): string {
        return this._inputPassword.getValue();
    }

    /**
     * setPassword
     * @param password
     */
    public setPassword(password: string): void {
        this._inputPassword.setValue(password);
    }

    /**
     * getPasswordRepeat
     */
    public getPasswordRepeat(): string {
        return this._inputPasswordRepeat.getValue();
    }

    /**
     * setPasswordRepeat
     * @param password
     */
    public setPasswordRepeat(password: string): void {
        this._inputPasswordRepeat.setValue(password);
    }

    /**
     * getPin
     */
    public getPin(): string {
        return this._inputPin.getValue();
    }

    public setPin(pin: string): void {
        this._inputPin.setValue(pin);
    }

    /**
     * getPinRepeat
     */
    public getPinRepeat(): string {
        return this._inputPinRepeat.getValue();
    }

    /**
     * setPinRepeat
     * @param pin
     */
    public setPinRepeat(pin: string): void {
        this._inputPinRepeat.setValue(pin);
    }

    /**
     * getEMail
     */
    public getEMail(): string {
        return this._inputEMail.getValue();
    }

    /**
     * setEMail
     * @param email
     */
    public setEMail(email: string): void {
        this._inputEMail.setValue(email);
    }

    /**
     * setMainGroupList
     * @param groups
     */
    public setMainGroupList(groups: GroupEntry[]): void {
        this._selectMainGroup.clearValues();

        for (const group of groups) {
            this._selectMainGroup.addValue({
                key: `${group.id}`,
                value: group.description
            });
        }
    }

    /**
     * getMainGroup
     */
    public getMainGroup(): number {
        return parseInt(this._selectMainGroup.getSelectedValue(), 10) || 0;
    }

    /**
     * setMainGroup
     * @param maingroup
     */
    public setMainGroup(maingroup: number): void {
        this._selectMainGroup.setSelectedValue(`${maingroup}`);
    }

    /**
     * setIsAdmin
     * @param isAdmin
     */
    public setIsAdmin(isAdmin: boolean): void {
        this._switchIsAdmin.setEnable(isAdmin);
    }

    /**
     * getIsAdmin
     */
    public getIsAdmin(): boolean {
        return this._switchIsAdmin.isEnable();
    }

    /**
     * setIsDisabled
     * @param isDisabled
     */
    public setIsDisabled(isDisabled: boolean): void {
        this._switchIsDisabled.setEnable(isDisabled);
    }

    /**
     * getIsDisabled
     */
    public getIsDisabled(): boolean {
        return this._switchIsDisabled.isEnable();
    }

    /**
     * resetValues
     */
    public override resetValues(): void {
        this.setId(null);
        this.setUsername('');
        this.setFullname('');
        this.setEMail('');
        this.setPassword('');
        this.setPasswordRepeat('');
        this.setPin('');
        this.setPinRepeat('');
        this.setMainGroup(0);
        this.setIsAdmin(false);
        this.setIsDisabled(false);
    }

}