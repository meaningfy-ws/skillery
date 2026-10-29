%% A request is either approved or rejected, not both.
1 { approved; rejected } 1 :- request.
%% A hard-blocked request must not be approved.
:- approved, blocked.
%% A hard-blocked request must not be rejected either.
:- rejected, blocked.
