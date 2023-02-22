const hbs = require('hbs');

hbs.registerPartials(`${__dirname}/../views/partials`);
hbs.registerPartials(`${__dirname}/../views/users/partials`);

hbs.registerHelper('activeSectionClass', (section, currentSection) => {
    return section === currentSection ? 'active' : 'inactive'
});

hbs.registerHelper('activeButtonClass', (section, currentSection) => {
    return section === currentSection ? 'btn-primary' : 'btn-secondary'
});

hbs.registerHelper('activeEditButton', (user, currentUser) => {
    return user === currentUser ? '' : 'inactive'
});

hbs.registerHelper('enableTextArea', (user, currentUser) => {
    return user === currentUser ? '' : 'readonly'
});
