%% A part is found once; the cut stops the search.
part_of(X, Y) :- direct_part_of(X, Y), !.
%% Remembering a part (a quoted '!' and a comment ! are not findings).
remember(X) :- assertz(seen(X)), atom_length('!', _).
