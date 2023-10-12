import {
    ButtonMenu, ButtonType,
    Card,
    ColumnContent,
    ContentCol,
    ContentColSize,
    ContentRow, IconFa,
    LangText,
    LeftNavbarLink,
    Table, Td,
    Th,
    Tr
} from 'bambooo';
import {Group as GroupAPI} from '../Api/Group';
import {User as UserAPI, UserData} from '../Api/User';
import {Lang} from '../Lang';
import {BasePage} from './BasePage';
import {UsersEditModal} from './Users/UsersEditModal';

/**
 * Users
 */
export class Users extends BasePage {

    /**
     * page name
     * @protected
     */
    protected _name: string = 'admin-users';

    /**
     * users dialog
     * @protected
     */
    protected _usersDialog: UsersEditModal;

    /**
     * constructor
     */
    public constructor() {
        super();

        // dialogs modal -----------------------------------------------------------------------------------------------

        this._usersDialog = new UsersEditModal(
            this._wrapper.getContentWrapper().getContent().getElement()
        );

        // Navbar Left -------------------------------------------------------------------------------------------------

        // eslint-disable-next-line no-new
        new LeftNavbarLink(this._wrapper.getNavbar().getLeftNavbar(), 'Add User', async() => {
            const groups = await GroupAPI.getGroupList();

            this._usersDialog.resetValues();
            this._usersDialog.setTitle('Add User');

            if (groups) {
                this._usersDialog.setMainGroupList(groups);
            }

            this._usersDialog.show();
            return false;
        });

        // users dialog save -------------------------------------------------------------------------------------------

        this._usersDialog.setOnSave(async(): Promise<void> => {
            let tid = this._usersDialog.getId();

            if (tid === null) {
                tid = 0;
            }

            try {
                const aUser: UserData = {
                    id: tid,
                    username: this._usersDialog.getUsername(),
                    fullname: this._usersDialog.getFullname(),
                    email: this._usersDialog.getEMail(),
                    main_groupid: this._usersDialog.getMainGroup(),
                    isAdmin: this._usersDialog.getIsAdmin(),
                    disable: this._usersDialog.getIsDisabled()
                };

                const password = this._usersDialog.getPassword();
                const pin = this._usersDialog.getPin();

                if (password !== '') {
                    aUser.password = password;
                    aUser.password_repeat = this._usersDialog.getPasswordRepeat();
                }

                if (pin !== '') {
                    aUser.pin = pin;
                    aUser.pin_repeat = this._usersDialog.getPinRepeat();
                }

                if (await UserAPI.save(aUser)) {
                    this._usersDialog.hide();

                    if (this._onLoadTable) {
                        this._onLoadTable();
                    }

                    this._toast.fire({
                        icon: 'success',
                        title: 'User save success.'
                    });
                }
            } catch ({message}) {
                this._toast.fire({
                    icon: 'error',
                    title: message
                });
            }
        });
    }

    /**
     * loadContent
     */
    public async loadContent(): Promise<void> {
        this._onLoadTable = async(): Promise<void> => {
            this._wrapper.getContentWrapper().getContent().empty();

            const row1 = new ContentRow(this._wrapper.getContentWrapper().getContent());
            const card = new Card(new ContentCol(row1, ContentColSize.col12));

            card.setTitle(new LangText('Users'));
            card.showLoading();

            const users = await UserAPI.getUserList();
            const groups = await GroupAPI.getGroupList();

            const table = new Table(card.getElement());
            const trhead = new Tr(table.getThead());

            // eslint-disable-next-line no-new
            new Th(trhead, new LangText('Id'));

            // eslint-disable-next-line no-new
            new Th(trhead, new ColumnContent([
                new LangText('Username'),
                new LangText('Fullname')
            ]));

            // eslint-disable-next-line no-new
            new Th(trhead, new LangText('EMail'));

            // eslint-disable-next-line no-new
            new Th(trhead, new LangText('Main-Group'));

            // eslint-disable-next-line no-new
            new Th(trhead, new LangText('Disabled'));

            // eslint-disable-next-line no-new
            new Th(trhead, '');

            if (users) {
                for (const user of users) {
                    const trbody = new Tr(table.getTbody());

                    // eslint-disable-next-line no-new
                    new Td(trbody, `#${user.id}`);

                    // eslint-disable-next-line no-new
                    new Td(trbody, new ColumnContent([
                        `${user.username}`,
                        `${user.fullname}`
                    ]));

                    // eslint-disable-next-line no-new
                    new Td(trbody, `${user.email}`);

                    let groupName = 'Unknown';

                    if (groups) {
                        for (const agroup of groups) {
                            if (agroup.id === user.main_groupid) {
                                groupName = agroup.description;
                            }
                        }
                    }

                    // eslint-disable-next-line no-new
                    new Td(trbody, `${groupName}`);

                    // eslint-disable-next-line no-new
                    new Td(trbody, new LangText(user.disable ? 'Yes' : 'No'));

                    // action
                    const actionTd = new Td(trbody, '');

                    const btnMenu = new ButtonMenu(
                        actionTd,
                        IconFa.bars,
                        true,
                        ButtonType.borderless
                    );

                    btnMenu.addMenuItem(
                        'Edit',
                        (): void => {
                            this._usersDialog.resetValues();
                            this._usersDialog.setTitle('Edit User');
                            this._usersDialog.setId(user.id);
                            this._usersDialog.setUsername(user.username);
                            this._usersDialog.setFullname(user.fullname);
                            this._usersDialog.setEMail(user.email);

                            if (groups) {
                                this._usersDialog.setMainGroupList(groups);
                            }

                            this._usersDialog.setMainGroup(user.main_groupid);
                            this._usersDialog.setIsAdmin(user.isAdmin);
                            this._usersDialog.setIsDisabled(user.disable);

                            this._usersDialog.show();
                        },
                        IconFa.edit
                    );
                }
            }

            card.hideLoading();
            Lang.i().lAll();
        };

        // load table
        this._onLoadTable();
    }

}