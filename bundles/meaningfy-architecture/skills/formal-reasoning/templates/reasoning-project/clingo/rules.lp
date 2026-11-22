%% A public client is priced at a fixed price.
pricing(fixed) :- client(public).
%% A tender is priced in time and materials.
pricing(tm) :- channel(tender).
%% Two pricing decisions conflict.
conflict :- pricing(X), pricing(Y), X < Y.
