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

hbs.registerHelper('redBtn', (user, artist) => {
    return user.some(x => x.id === artist.id) ? 'btn-danger' : 'btn-primary'
});

hbs.registerHelper('unfollowBtn', (user, artist) => {
    return user.some(x => x.id === artist.id) ? 'Unfollow' : 'Follow'
});

hbs.registerHelper('artistIncluded', function(user, artist, opt) {
    const ids = user.artists.map(x => x.id)
    return ids.includes(artist.id) ? opt.fn(this) : opt.inverse(this)
})

hbs.registerHelper('isArtist', function(element, opt) {
    if (!element.message) {
        return opt.fn(this)
    } else {
        return opt.inverse(this)
    }
})

hbs.registerHelper('isLiked', (arr, user, opt) => {
    if (arr?.filter(x => x.to === user.id)) {
        console.log(arr, user)
        return opt.fn(this)
    } else {
        return opt.inverse(this)
    }
})

hbs.registerHelper('isUser', function(user, currentUser, opt) {
    if (user.username !== currentUser.username) {
        return opt.fn(this)
    } else {
        return opt.inverse(this)
    }
})

hbs.registerHelper("date", (date) => {
    const minDiff = (Date.now() - date) / 1000 / 60;
  
    if (minDiff > 60 * 24) {
      return `${Math.round(minDiff / 60 / 24)}d ago`;
    }
  
    if (minDiff > 60) {
      return `${Math.round(minDiff / 60)}h ago`;
    }
  
    return `${Math.round(minDiff)}m ago`;
  });
  