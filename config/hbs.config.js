const hbs = require('hbs');

hbs.registerPartials(`${__dirname}/../views/partials`);
hbs.registerPartials(`${__dirname}/../views/users/partials`);

hbs.registerHelper('activeSectionClass', (section, currentSection) => {
    return section === currentSection ? 'active' : 'inactive'
});

hbs.registerHelper('activeButtonClass', (section, currentSection) => {
    return section === currentSection ? 'btn-primary' : 'btn-secondary'
});

hbs.registerHelper('activeEditButton', (path, currentPath) => {
    return currentPath.includes(path) ? 'active' : 'inactive'
});