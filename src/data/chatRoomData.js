const chatRoomEvents = [
    {delta: 1000,
        payload: {
            type: 'message',
            user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
            message: {id: 1, text: "Hello!"}
        }
    },
    {delta: 2000,
        payload: {
            type: 'message',
            user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
            message: {id: 2, text: "Hi Taco!"}
        }
    },
    {delta: 2100, payload: {type: 'connect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}},
    {delta: 3000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 3, text: "Hi Taco!"}
        }
    },
    // Noticed that delta 4000 had an incorrect user.id for 'pete'. I changed it to 3
    {delta: 4000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 4, text: "What's going on in here?"}
        }
    },
    {delta: 5000,
        payload: {
            type: 'message',
            user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
            message: {id: 5, text: "We're testing this chat replay app"}
        }
    },
    {delta: 6000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 6, text: "Seems like it's working fine … in the *simple* case :)"}
        }
    },
    {delta: 6500,
        payload: {
            type: 'message',
            user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
            message: {id: 7, text: "Cool!"}
        }
    },
    {delta: 6600, payload: {type: 'update', user: {id: 2, username: 'chorizothecat', display_name: 'Chorizo the Cat'}}},
    {delta: 7000, payload: {type: 'update', message: {id: 6, text: "Seems like it's working find … for *edits* also"}}},
    {delta: 8000,
        payload: {
            type: 'message',
            user: {id: 2, username: 'chorizothecat', display_name: 'Chorizo the Cat'},
            message: {id: 8, text: "Just following @pete's lead…"}
        }
    },
    {delta: 8250,
        payload: {
            type: 'message',
            user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
            message: {id: 9, text: "We _know_ you're a cat @chorizothecat :facepalm:"}
        }
    },
    {delta: 10000, payload: {type: 'update', user: {id: 2, username: 'chorizo', display_name: 'Chorizo'}}},
    {delta: 11000,
        payload: {
            type: 'message',
            user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
            message: {
                id: 10,
                text: "Oh fine … I mostly just wanted to see what happened when I changed my profile.  Sorry @taco :scream_cat:"
            }
        }
    },
    {delta: 12000, payload: {type: 'delete', message: {id: 9}}},
    {delta: 14000, payload: {type: 'delete', message: {id: 10}}},
    {delta: 15000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {
                id: 11,
                text: "Well, _that_ was fun.  Changing the subject … have you seen https://en.wikipedia.org/wiki/Market_share_of_personal_computer_vendors?"
            }
        }
    },
    {delta: 20000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 12, text: "_I_ thought it was pretty interesting.\n\nReally makes you *think*."}
        }
    },
    {delta: 30000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 13, text: "Anyone…?  @taco?  @chorizo?"}
        }
    },
    {delta: 31000, payload: {type: 'disconnect', user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'}}},
    {delta: 31002, payload: {type: 'disconnect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
    {delta: 32000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 14, text: "Aww :sob:"}
        }
    },
    {delta: 33100, payload: {type: 'connect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
    {delta: 33150, payload: {type: 'disconnect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
    {delta: 34000, payload: {type: 'connect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
    {delta: 36000,
        payload: {
            type: 'message',
            user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
            message: {id: 15, text: "Whoops, I'm back.  Flaky wireless connection :ghost:…"}
        }
    },
    {delta: 36100, payload: {type: 'disconnect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
    {delta: 66000, payload: {type: 'disconnect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}}
];

const getChatLogEvents = () => {
    return chatRoomEvents
}

export default getChatLogEvents;