% The spike playbook (openspec/changes/archive/2026-10-29-reasoning-capabilities/inputs/spike/playbook.lp): situations, strengths, rules.
val(client,public;client,private;client,us; channel,email;channel,tender;channel,call; lang,en;lang,fr).
str(hard,3;default,2;soft,1).

rule(r1,spelling,british,default).     rule(r2,spelling,american,default). scope(r2,client,us).
rule(r3,send,after_approval,hard).
rule(r4,first_step,compliance_matrix,default). scope(r4,channel,tender).
rule(r5,pricing,fixed,default).        scope(r5,client,public).
rule(r6,pricing,time_and_materials,default). scope(r6,channel,tender).
rule(r7,length,under_400_words,soft).  scope(r7,channel,email).
rule(r8,length,under_400_words,soft).  scope(r8,client,us). scope(r8,channel,email).
rule(r9,send,immediately,default).     scope(r9,lang,fr).
