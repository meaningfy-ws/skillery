:- table part_of/2.
%% A direct part is a part.
part_of(X, Y) :- direct_part_of(X, Y).
%% A part of a part is a part of the whole.
part_of(X, Z) :- part_of(X, Y), part_of(Y, Z).
