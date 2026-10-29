%% A public client is priced at a fixed price.
pricing(fixed) :- client(public).
pricing(tm) :- channel(tender).
